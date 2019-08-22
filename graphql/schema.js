const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Post {
        _id: ID
        title: String!
        content: String!
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

   type RootQuery {
       loginUser(email: String! , password: String!) : AuthData
   }

   type RootMutation {
       createUser(userInput: UserInputData) : User!
       createPost(postInput: PostInputData) : Post!
   }

   schema {
       query: RootQuery
       mutation: RootMutation
   }
`);