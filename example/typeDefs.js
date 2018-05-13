const typeDefs = `
  scalar Time
  scalar Email
  scalar Username

  type Author {
    id: ID!
    username: Username!
    email: Email!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: Author!
    createdAt: Time
  }

  type Query {
    posts: [Post]
    authors: [Author]
  }

  type Mutation {
    createAuthor (username: Username!, email: Email!): Author
    createPost (title: String!, body: String!, authorId: ID!): Post
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = typeDefs;
