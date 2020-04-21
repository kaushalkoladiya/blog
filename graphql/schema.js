const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  schema {
    mutation: RootMutation
    query: RootQuery
  }

  type RootMutation {
    createUser(signupUserData: SignupUserInputData): UserCreateSuccessfully!
    updateUser(updateUserData: SignupUserInputData, userId: UserId): User!
    showUser(userId: UserId): User!
    updatePassword(updatePasswordData: UpdatePasswordData, userId: UserId): UpdatePasswordSucessfully!

    createBlog(createBlogData: CreateBlogData): Blog!
    showBlog(blogId: BlogId): Blog!
    updateBlog(updateBlogData: CreateBlogData, blogId: BlogId): Blog!
    deleteBlog(blogId: BlogId): DeleteBlog!
  }

  type RootQuery {
    loginUser(loginUserData: LoginUserInputData): LoginUserSuccessfully!
    blogs(page: Int!): BlogData!
  }

  type Blog {
    _id: ID!
    title: String!
    subtitle: String!
    description: String!
    url: String!
    userId: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    blogs: [Blog]!
    createdAt: String!
    updatedAt: String!
  }

  type UserCreateSuccessfully {
    result: String!
  }

  type LoginUserSuccessfully {
    token: String!
    userId: String!
  }

  type DeleteBlog {
    delete: Boolean!
  }

  type BlogData {
    blogs: [Blog!]!
    totalBlogs: Int!
  }

  type UpdatePasswordSucessfully {
    result: String!
  }

  input SignupUserInputData {
    email: String!
    name: String!
    password: String!
    confirm_password: String
  }

  input LoginUserInputData {
    email: String!
    password: String!
  }

  input CreateBlogData {
    title: String!
    subtitle: String!
    description: String!
    url: String!
  }

  input BlogId {
    _id: String!
  }

  input UserId {
    _id: String!
  }

  input UpdatePasswordData {
    oldPassword: String!
    newPassword: String!
    newConfirmPassword: String!
  }
`);