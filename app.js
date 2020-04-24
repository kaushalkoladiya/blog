const express = require('express');
const bodyParser = require("body-parser");
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const graphqlHTTP = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const AuthMiddleware = require('./middleware/AuthMiddleware');

const authRoute = require('./router/auth');
const blogRoute = require('./router/blog');

const app = express();

const accessLog = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{ flags: 'a' }
);

app.use(helmet());
app.use(morgan('combined', { stream: accessLog }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Go to our official site<h1><a href="https://blognode.netlify.com">blognode</h1>');
});

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method == 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(AuthMiddleware);

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		customFormatErrorFn(err) {
			if (!err.originalError) {
				return err;
			}
			const data = err.originalError.data;
			const code = err.originalError.code || 500;
			const message = err.message || 'Internal server error';
			return { message: message, status: code, data: data };
		}
	})
);



// app.use(authRoute);
// app.use('/blog', blogRoute);

// Error headler
app.use((err, req, res, next) => {
	console.log(err);
	// res.status(err.httpStatusCode || 500).json({ result: err.message });
	res.status(err.httpStatusCode || 500).json({ result: err.message, data: err.data || "" });
});

module.exports = app;