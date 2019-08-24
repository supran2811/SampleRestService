const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Post {
        _id: ID
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        status: String
        name: String!
        posts : [Post!]!
    }

    type AuthData {
        userId: String!
        token: String!
    }

    type PostsListData {
        posts: [Post!]
        totalItems: Int!
    }

   input UserInputData {
       email: String!
       password: String!
       name: String!
   }

   input PostInputData {
       title: String!
       content: String!
       imageUrl: String!
   }

   
   input UpdatePostInputData {
    id: ID!
    title: String!
    content: String!
    imageUrl: String!
   }

   type RootQuery {
       loginUser(email: String! , password: String!) : AuthData!
       getPosts(page: Int!) : PostsListData!
       getPost(postId: String!) : Post!
       getUserStatus: String!
   }

   type RootMutation {
       createUser(userInput: UserInputData) : User!
       createPost(postInput: PostInputData) : Post!
       updatePost(postInput: UpdatePostInputData) : Post!
       deletePost(id: ID!) : Boolean! 
   }

   schema {
       query: RootQuery
       mutation: RootMutation
   }
`);