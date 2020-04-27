const bcypt = require('bcryptjs');

const User = require('../model/User');

exports.update = async ({ updateUserData: { name, email, password }, userId: { _id: userId } }, req) => {
  if (userId !== req.userId) {
    const err = new Error('Action Forbidden.');
    err.code = 403;
    throw err;
  }
  let user;
  const isExists = await User.exists({ email: email });
  if (isExists) {
    user = await User.findOne().where({ _id: req.userId, email: email });
    if (!user) {
      const err = new Error('Email already exists.');
      err.code = 400;
      throw err;
    }
  }

  if (!user) {
    const err = new Error('Internal server error.');
    err.code = 500;
    throw err;
  }

  const isEqual = await bcypt.compare(password, user.password)
  if (!isEqual) {
    const err = new Error('Wrong Password!')
    err.code = 400
    throw err
  }

  user = await User.findByIdAndUpdate(userId, {
    name: name,
    email: email
  }, { new: true });

  return {
    ...user._doc,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

exports.show = async ({ _id: userId }) => {
  const user = await User.findById(userId).populate('blogs');
  if (!user) {
    const err = new Error('Not Found!')
    err.code = 404
    throw err
  }

  return {
    ...user._doc,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    blogs: user.blogs.map((blog) => {
      return {
        ...blog._doc,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      }
    })
  }
}

exports.updatePassword = async ({ updatePasswordData: { oldPassword, newPassword }, userId: { _id: userId } }, req) => {
  if (userId !== req.userId) {
    const err = new Error('Action Forbidden.');
    err.code = 403;
    throw err;
  }

  const user = await User.findById(userId);

  if (!user) {
    const err = new Error('Internal server error.');
    err.code = 500;
    throw err;
  }

  const isEqual = await bcypt.compare(oldPassword, user.password)
  if (!isEqual) {
    const err = new Error('Wrong Password!')
    err.code = 400
    throw err
  }

  const hashedPassword = await bcypt.hash(newPassword, 12);
  if (!hashedPassword) {
    const err = new Error('Internal server error.');
    err.code = 500;
    throw err;
  }

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword
  }, { new: true });

  return {
    result: 'success'
  };
}

exports.favList = async (req) => {
  const user = await User.findById(req.userId).populate('favoriteBlogs');
  return {
    blogs: user.favoriteBlogs,
    totalBlogs: user.favoriteBlogs.length
  };
}