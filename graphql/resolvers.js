const niv = require('node-input-validator');

const User = require('../model/User');

const AuthController = require('../controller/AuthController');
const BlogController = require('../controller/BlogController');
const UserController = require('../controller/UserController');

niv.extend('unique', async ({ value }) => {
  // default field is email in this method
  let condition = {
    email: value
  };

  const isEmailExist = await User.exists(condition);
  if (isEmailExist) {
    return false;
  }
  return true;
});

niv.extendMessages({
  required: 'The :attribute field must not be empty.',
  email: 'E-mail must be a valid email address.',
  minLength: 'The :attribute is too short',
  string: 'The :attribute must be string',
  unique: 'Email is already used.',
  equals: 'The password does not match'
}, 'en');

module.exports = {
  // Operations on User table
  createUser: async ({ signupUserData }, req) => {
    const password = signupUserData.password;
    niv.extend('equals', ({ value, args }) => (password === value) ? true : false);

    const validatedData = new niv.Validator(signupUserData, {
      email: 'required|email|unique:User,email',
      name: 'required|string|minLength:5',
      password: 'required|string|minLength:5',
      confirm_password: 'equals',

    })

    const hasError = await validatedData.check();

    if (!hasError) {
      const err = new Error('Validatoin Failed.');
      err.code = 400;
      err.data = validatedData.errors;
      throw err;
    }

    return AuthController.signup(signupUserData, req);
  },

  loginUser: async ({ loginUserData }, req) => {
    const validatedData = new niv.Validator(loginUserData, {
      'email': 'required|email',
      'password': 'required|string'
    })
    const hasError = await validatedData.check()

    if (!hasError) {
      const err = new Error('Validation failed.')
      err.code = 400
      err.data = validatedData.errors
      throw err
    }

    return AuthController.login(loginUserData, req)
  },

  updateUser: async ({ updateUserData, userId }, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }

    const validatedData = new niv.Validator(updateUserData, {
      email: 'required|email',
      name: 'required|string|minLength:5',
      password: 'required|string|minLength:5',
    });

    const hasError = await validatedData.check();

    if (!hasError) {
      const err = new Error('Validatoin Failed.');
      err.code = 400;
      err.data = validatedData.errors;
      throw err;
    }
    return UserController.update({ updateUserData: updateUserData, userId: userId }, req);
  },

  showUser: ({ userId }) => {
    return UserController.show(userId);
  },

  updatePassword: async ({ updatePasswordData, userId }, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }
    const password = updatePasswordData.newPassword;
    niv.extend('equals', ({ value }) => (password === value) ? true : false);

    const validatedData = new niv.Validator(updatePasswordData, {
      newPassword: 'required|string|minLength:5',
      newConfirmPassword: 'equals',
    });

    const hasError = await validatedData.check();
    if (!hasError) {
      const err = new Error('Validatoin Failed.');
      err.code = 400;
      err.data = validatedData.errors;
      throw err;
    }
    return UserController.updatePassword({ updatePasswordData: updatePasswordData, userId: userId }, req);
  },

  favList: (args, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }
    return UserController.favList(req);
  },

  // Operations on Blog table
  blogs: ({ page }, req) => {
    return BlogController.index(page)
  },

  createBlog: async ({ createBlogData }, req) => {

    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }

    const validatedData = new niv.Validator(createBlogData, {
      title: 'required|string|minLength:5',
      subtitle: 'required|string|minLength:5',
      description: 'required|string|minLength:20',
      url: 'string',
    });

    const hasError = await validatedData.check();
    if (!hasError) {
      const err = new Error('Validatoin Failed.');
      err.code = 400;
      err.data = validatedData.errors;
      throw err;
    }

    return BlogController.store(createBlogData, req)
  },

  showBlog: ({ blogId }, req) => {
    return BlogController.show(blogId, req);
  },

  updateBlog: async ({ updateBlogData, blogId }, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }

    const validatedData = new niv.Validator(updateBlogData, {
      title: 'required|string|minLength:5',
      subtitle: 'required|string|minLength:5',
      description: 'required|string|minLength:20',
      url: 'string',
    });

    const hasError = await validatedData.check();
    if (!hasError) {
      const err = new Error('Validatoin Failed.');
      err.code = 400;
      err.data = validatedData.errors;
      throw err;
    }
    return BlogController.update({ updateBlogData: updateBlogData, blogId: blogId }, req);
  },

  deleteBlog: ({ blogId }, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }
    // console.log('hiu');
    return BlogController.remove(blogId, req);
  },

  addToFav: (args, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }
    return BlogController.addToFav(args, req);
  },

  removeFromFav: (args, req) => {
    if (!req.isAuth) {
      const err = new Error('Token Expired.');
      err.code = 401;
      throw err;
    }
    return BlogController.removeFromFav(args, req);
  }

}