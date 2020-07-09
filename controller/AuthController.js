const { validationResult } = require('express-validator/check');
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

exports.signup = async ({ email, name, password }, req) => {
  const hashedPassword = await bcypt.hash(password, 12);
  if (!hashedPassword) {
    const err = new Error('Internal server error.');
    err.code = 500;
    throw err;
  }

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword
  });

  if (!user) {
    const err = new Error('Internal server error.');
    err.code = 500
    throw err
  }

  return { result: "user create successfully" }
}

exports.login = async ({ email, password }, req) => {
  const user = await User.findOne({ email: email })

  if (!user) {
    const err = new Error('Candidate does not match with our database!')
    err.code = 404
    throw err
  }

  const isEqual = await bcypt.compare(password, user.password)
  if (!isEqual) {
    const err = new Error('Password does not match!')
    err.code = 400
    throw err
  }

  const token = jwt.sign({
    email: user.email,
    userId: user._id.toString()
  }, 'LoveYouBabe', { expiresIn: '1h' })

  return {
    token: token,
    userId: user._id.toString()
  }
}