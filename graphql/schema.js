const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Post {
        _id: ID
        title: String!
        content: String!
        creator: User!
        createAt: String!
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

   input UserInputData {
       email: String!
       password: String!
       name: String!
   }

   type RootQuery {
    hello: String!
   }

   type RootMutation {
       createUser(userInput: UserInputData) : User!
   }

   schema {
       query: RootQuery
       mutation: RootMutation
   }
`);