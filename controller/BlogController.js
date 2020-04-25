// const { validationResult } = require('express-validator/check')

const Blog = require('../model/Blog')
const User = require('../model/User')
/*
exports.index = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find()
      .limit(5)
      .populate('userId')

    if (!blogs) {
      const err = new Error('Internal server error')
      err.httpStatusCode = 500
      throw err
    }
    // console.log(blogs);

    res.status(200).json({
      result: 'success',
      blogs: blogs
    })
  } catch (error) {
    next(error)
  }
}

exports.store = async (req, res, next) => {
  try {
    const validatedData = validationResult(req)
    if (!validatedData.isEmpty()) {
      console.log(validatedData.errors);
      const err = new Error('Validation failed.')
      err.httpStatusCode = 402
      throw err
    }

    const title = req.body.title
    const subtitle = req.body.subtitle || ''
    const description = req.body.description
    const url = req.body.url || ''

    const blog = await Blog.create({
      title: title,
      subtitle: subtitle,
      description: description,
      url: url,
      userId: req.userId
    });

    if (!blog) {
      const err = new Error('Internal server error.')
      err.httpStatusCode = 500
      throw err
    }

    const user = await User.findById(req.userId)

    if (!user) {
      const err = new Error('Internal server error.')
      err.httpStatusCode = 500
      throw err
    }

    user.blogs.push(blog._id)
    user.save()

    res.status(200).json({
      result: 'success',
      blog: blog
    })


  } catch (error) {
    next(error)
  }
}


exports.show = async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const blog = await Blog.findById(blogId).populate('userId')

    if (!blog) {
      const err = new Error('Internal server error.')
      err.httpStatusCode = 500
      throw err
    }

    res.status(200).json({
      result: 'success',
      blog: blog
    })

  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const validatedData = validationResult(req)
    if (!validatedData.isEmpty()) {
      const err = new Error('Validation failed.')
      err.httpStatusCode = 402
      throw err
    }

    const blogId = req.params.blogId

    const title = req.body.title
    const subtitle = req.body.subtitle || ''
    const description = req.body.description
    const url = req.body.url || ''

    const blog = await Blog.findByIdAndUpdate(blogId, {
      title: title,
      subtitle: subtitle,
      description: description,
      url: url
    }).where('userId', req.userId)

    if (!blog) {
      const err = new Error('Action Forbidden.')
      err.httpStatusCode = 403
      throw err
    }

    res.status(200).json({
      result: 'success',
      blog: blog
    })

  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const isAuthorize = await Blog.findByIdAndDelete(blogId).where('userId', req.userId)

    if (!isAuthorize) {
      const err = new Error('Action Forbidden.')
      err.httpStatusCode = 403
      throw err
    }

    const user = await User.findById(req.userId)

    console.log(user.blogs)

    user.blogs.pull(blogId)
    var result = user.save()

    res.status(200).json({
      result: 'success',
      delete: result
    })


  } catch (error) {
    next(error)
  }
}
*/

exports.index = async (page, req) => {
  if (!page) {
    page = 1;
  }
  const perPage = 5;
  const totalBlogs = await Blog.countDocuments();

  const blogs = await Blog
    .find()
    .sort({ createdAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .populate('userId');

  if (!blogs) {
    const err = new Error('Internal server error')
    err.code = 500
    throw err
  }

  return {
    blogs: blogs.map((blog) => {
      return {
        ...blog._doc,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toISOString(),
        userId: {
          ...blog._doc.userId,
          _id: blog.userId._id.toString(),
          name: blog.userId.name
        }
      };
    }),
    totalBlogs: totalBlogs
  }
}

exports.store = async ({ title, subtitle, description, url }, req) => {
  let blog = await Blog.create({
    title: title,
    subtitle: subtitle,
    description: description,
    url: url,
    userId: req.userId
  });

  if (!blog) {
    const err = new Error('Internal server error.')
    err.code = 500
    throw err
  }

  blog = await Blog.findById(blog._id).populate('userId');

  const user = await User.findById(req.userId)

  if (!user) {
    const err = new Error('Internal server error.')
    err.code = 500
    throw err
  }

  user.blogs.push(blog._id)
  user.save()

  return {
    ...blog._doc,
    userId: {
      _id: blog.userId._id.toString(),
      name: blog.userId.name,
    },
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString()
  }
}

exports.show = async ({ _id: blogId }, req) => {
  const blog = await Blog.findById(blogId).populate('userId')

  if (!blog) {
    const err = new Error('Internal server error.')
    err.code = 500
    throw err
  }

  return {
    ...blog._doc,
    userId: {
      _id: blog.userId._id.toString(),
      name: blog.userId.name,
    },
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString()
  }
}

exports.update = async ({ updateBlogData: { title, subtitle, description, url }, blogId: { _id: blogId } }, req) => {
  const blog = await Blog.findByIdAndUpdate(blogId, {
    title: title,
    subtitle: subtitle,
    description: description,
    url: url
  }, { new: true })
    .where('userId', req.userId)
    .populate('userId');

  if (!blog) {
    const err = new Error('Action Forbidden.')
    err.code = 403
    throw err
  }

  return {
    ...blog._doc,
    userId: {
      _id: blog.userId._id.toString(),
      name: blog.userId.name,
    },
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
  };
}

exports.remove = async ({ _id: blogId }, req) => {
  const isAuthorize = await Blog.findByIdAndDelete(blogId).where('userId', req.userId)

  if (!isAuthorize) {
    const err = new Error('Action Forbidden.')
    err.httpStatusCode = 403
    throw err
  }

  const user = await User.findById(req.userId)

  user.blogs.pull(blogId)
  await user.save()

  return {
    delete: true
  }
}