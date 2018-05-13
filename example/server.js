const express =require('express');
const bodyParser =require('body-parser');
const { graphqlExpress } =require('apollo-server-express');
const { makeExecutableSchema } =require('graphql-tools');
const expressPlayground =require('graphql-playground-middleware-express').default;

const typeDefs =require('./typeDefs');
const resolvers =require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const {PORT} = process.env;

const app = express();
const json = bodyParser.json();
const graphql = graphqlExpress({ schema });
const playground = expressPlayground({ endpoint: '/graphql' });

app.use('/graphql', json, graphql);
app.get('/playground', playground);
app.listen(PORT);

console.log(`Running /graphql and /playground on port ${PORT}`);
