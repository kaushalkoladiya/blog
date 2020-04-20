const express = require('express');
const { body } = require('express-validator/check');

const User = require('../model/User');
const AuthController = require('../controller/AuthController');

// Add middleware which is applyed wuth JWT

const router = express.Router();

router.put('/signup', [
  body('name').isString().isLength({ min:2, max:20 }).trim().notEmpty().withMessage('Name should be characters only.'),
  body('email').isEmail().trim().notEmpty().withMessage('Invalied Email.'),
  body('password').isString().isLength({ min: 5, max: 50 }).trim().notEmpty().withMessage('Password should be minimum 5 characters.'),
  body('confirm_password').custom((value, { req }) => (value !== req.body.password) ? false : true ).withMessage('Password does not match'),
], AuthController.signup);

router.post('/login', [
  body('email').isString().notEmpty().withMessage('Email is required!'),
  body('password').isString().notEmpty().withMessage('Pasword is required!'),
], AuthController.login);


module.exports = router;