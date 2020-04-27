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
    favList: BlogData!
    
    createBlog(createBlogData: CreateBlogData): Blog!
    showBlog(blogId: BlogId): ShowBlog!
    updateBlog(updateBlogData: CreateBlogData, blogId: BlogId): Blog!
    deleteBlog(blogId: BlogId): DeleteBlog!
    addToFav(blogId: BlogId, userId: UserId): Success!
    removeFromFav(blogId: BlogId, userId: UserId): Success!
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

  type ShowBlog {
    blog: Blog!
    isFav: Boolean!
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

  type Success {
    result: String
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