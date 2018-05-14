const typeDefs = `
  scalar Time
  scalar Email
  scalar Username
  scalar UUID

  type Author {
    id: UUID!
    username: Username!
    email: Email!
    createdAt: Time!
    # REFS
    posts: [Post!]!
  }

  type Post {
    id: UUID!
    title: String!
    body: String!
    authorId: UUID!
    createdAt: Time!
    # REFS
    author: Author!
  }

  type Query {
    posts: [Post]
    post(id: UUID!): Post
    authors: [Author]
    author(id: UUID!): Author
  }

  type Mutation {
    createAuthor (username: Username!, email: Email!): Author
    createPost (title: String!, body: String!, authorId: UUID!): Post
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = typeDefs;
