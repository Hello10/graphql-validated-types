const {
  Author,
  Post
} = require('./collections');

module.exports = function loadFakeData () {
  const FAKE_AUTHORS = [
    {
      username: 'randall',
      email: 'randy@quaid.gov',
    },
    {
      username: 'dennissux',
      email: 'randy@quaidnet.net'
    },
    {
      username: 'cautolives',
      email: 'quaid@recall.biz'
    }
  ].map(Author.create.bind(Author));

  const FAKE_POSTS = FAKE_AUTHORS.map(({id})=> {
    return Post.create({
      authorId: id,
      title: 'ZOMG This Is My First Post',
      body: 'My brother Dennis is such a turd'
    });
  });

  return {
    FAKE_AUTHORS,
    FAKE_POSTS
  };
};
