const Moment = require('moment');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedMoment,
  GraphQLValidatedString
} = require('../index');

const {Author, Post} = require('./collections');

GraphQLValidatedMoment.Moment = Moment;

const Email = new GraphQLValidatedEmail();

const Time = new GraphQLValidatedMoment({
	name: 'Time'
});

const Username = new GraphQLValidatedString({
	name: 'Username'
}).length({min: 2, max: 16}).squish();

const UUID = new GraphQLValidatedString({
  name: 'UUID'
}).regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
);

const ScalarResolvers = {
  Email,
  Time,
  Username,
  UUID
};

const resolvers = {
  Query: {
    posts () {
      return Post.find();
    },
    post (_, {id}) {
      return Post.find({id});
    },
    authors () {
      return Author.find();
    },
    author (_, {id}) {
      return Author.find({id});
    }
  },
  Mutation: {
    createPost (_, args) {
      return Post.create(args);
    },
    createAuthor (_, args) {
      return Author.create(args);
    }
  },
  Author: {
    posts (author) {
      return Post.find({ authorId: author.id });
    },
  },
  Post: {
    author(post) {
      let result = Author.find({ id: post.authorId });
      return (result.length) ? result[0] : null;
    },
  },
  ...ScalarResolvers
};

module.exports = resolvers;
