const Moment = require('moment');
const {
  GraphQLValidatedEmail,
  GraphQLValidatedMoment,
  GraphQLValidatedString
} = require('../index');

GraphQLValidatedMoment.Moment = Moment;

const Email = new GraphQLValidatedEmail();

const Time = new GraphQLValidatedMoment({
	name: 'Time'
});

const Username = new GraphQLValidatedString({
	name: 'Username'
}).length({min: 2, max: 16}).squish();

const ScalarResolvers = {
  Email,
  Time,
  Username
};

const data = {
  posts: [],
  authors: []
}

const resolvers = {
  Query: {
    posts () {
      return data.posts;
    },
    authors () {
      return data.authors;
    }
  },
  Mutation: {
    createPost (_, args) {
      args.createdAt = new Moment();
    },
    createAuthor (_, args) {

    }
  },
  Author: {
    posts (author) {
      return filter(data.posts, { authorId: author.id });
    },
  },
  Post: {
    author(post) {
      return find(authors, { id: post.authorId });
    },
  },
  ...ScalarResolvers
};

module.exports = resolvers;
