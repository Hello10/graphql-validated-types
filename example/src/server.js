const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const loadFakeData = require('./loadFakeData');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const {
  FAKE_AUTHORS,
  FAKE_POSTS
} = loadFakeData();

function printCollection ({name, list}) {
  const ids = list.map(({id})=> id).join(', ');
  console.log(`${name}: ${ids}`);
  console.log(JSON.stringify(list, null, 1));
}

console.log('Created fake data');
printCollection({name: 'Authors', list: FAKE_AUTHORS});
console.log();
printCollection({name: 'Posts', list: FAKE_POSTS});

const {PORT} = process.env;

const app = express();
const server = new ApolloServer({
  schema,
  playground: {
    endpoint: '/graphql'
  }
});

server.applyMiddleware({app});
app.listen(PORT);

console.log(`Running /graphql and /playground on port ${PORT}`);
