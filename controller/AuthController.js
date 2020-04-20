const { validationResult } = require('express-validator/check');
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

exports.signup = async (req, res, next) => {
  try {
    const validatedData = validationResult(req);
    if(!validatedData.isEmpty()) {
      const err = new Error('Validation failed.')
      err.httpStatusCode = 400;
      err.data = validatedData.errors;
      throw(err);
    } 

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const userExist = await User.exists({ email: email });
    if(userExist) {
      const err = new Error("Email is already used.");
      err.httpStatusCode = 422;
      throw err;
    }

    const hashedPassword = await bcypt.hash(password, 12);
    if(!hashedPassword) {
      const err = new Error('Internal server error.');
      err.httpStatusCode = 500;
      throw err;
    }

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    if(!user) {
      const err = new Error('Internal server error.');
      err.httpStatusCode = 500
      throw err
    }

    res.status(200).json({
      result: 'success'
    })
    
  } catch (error) {
    next(error);
  }
}

exports.login = async (req, res, next) => {
  try {
    const validatedData = validationResult(req);
    if(!validatedData.isEmpty()) {
      const err = new Error('Validation failed.')
      err.httpStatusCode = 400
      err.data = validatedData.errors
      throw err
    }

    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({ email: email })

    if(!user){
      const err = new Error('Candidate does not match with our database!')
      err.httpStatusCode = 404
      throw err
    }

    const isEqual = await bcypt.compare(password, user.password)
    if(!isEqual) {
      const err = new Error('Password does not match!')
      err.httpStatusCode = 400
      throw err
    }

    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    }, 'OurBlog', { expiresIn: '1h' })


    
    res.status(200).json({
      result: 'success',
      token: token,
      userId: user._id.toString()
    })
  } catch (error) {
    next(error)
  }
}