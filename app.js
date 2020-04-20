const express = require('express');
const bodyParser = require("body-parser");

const authRoute = require('./router/auth');
const blogRoute = require('./router/blog');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hii, there');
});

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(authRoute);
app.use('/blog', blogRoute);

// Error headler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.httpStatusCode || 500).json({ result: err.message });
});

module.exports = app;