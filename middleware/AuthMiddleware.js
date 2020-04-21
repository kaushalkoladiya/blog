const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization')
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'LoveYouBabe')
  } catch (error) {
    req.isAuth = false
    return next()
  }

  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  // console.log(decodedToken)

  req.userId = decodedToken.userId
  req.isAuth = true
  next()
}