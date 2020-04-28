const express = require('express');
const { body } = require('express-validator');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const BlogController = require('../controller/BlogController');

const router = express.Router();

router.post('/', AuthMiddleware, BlogController.index);

router.post('/store', AuthMiddleware, [
  body('title').isString().isLength({ min: 5 }).trim().notEmpty().withMessage('Title must be string only.'),
  body('subtitle').isString().trim().withMessage('Subtitle must be string only.'),
  body('description').isString().isLength({ min: 20 }).notEmpty().trim().withMessage('Description must be atleast 20 character.'),
], BlogController.store);

router.get('/:blogId', AuthMiddleware, BlogController.show);

router.patch('/update/:blogId', AuthMiddleware, [
  body('title').isString().isLength({ min: 5 }).trim().notEmpty().withMessage('Title must be string only.'),
  body('subtitle').isString().trim().withMessage('Subtitle must be string only.'),
  body('description').isString().isLength({ min: 20 }).notEmpty().trim().withMessage('Description must be 20 characters atleast.'),
], BlogController.update);

router.delete('/delete/:blogId', AuthMiddleware, BlogController.remove);

module.exports = router;