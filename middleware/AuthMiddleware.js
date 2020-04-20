const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization')
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'OurBlog')
  } catch (error) {
    error.httpStatusCode = 500
    throw error
  }

  if(!decodedToken) {
    const error = new Error('Not Authenticated')
    error.httpStatusCode = 402
    throw error
  }
  // console.log(decodedToken)

  req.userId = decodedToken.userId
  next()
}