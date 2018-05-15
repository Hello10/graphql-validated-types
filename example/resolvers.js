const Moment = require('moment');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedMoment,
  GraphQLValidatedString
} = require('../index');

const {Author, Post} = require('./collections');

GraphQLValidatedMoment.Moment = Moment;

const Email = new GraphQLValidatedEmail();

const CreateTime = new GraphQLValidatedMoment({
	name: 'CreateTime'
})
  .beforeNow()
  .outputFormat('YYYY/MM/DD HH:mm Z');

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
  CreateTime,
  Username,
  UUID
};

const resolvers = {
  Query: {
    posts () {
      return Post.find();
    },
    post (_, {id}) {
      return Post.findOne({id});
    },
    authors () {
      return Author.find();
    },
    author (_, {id}) {
      return Author.findOne({id});
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
    author (post) {
      return Author.findOne({ id: post.authorId });
    },
  },
  ...ScalarResolvers
};

module.exports = resolvers;
