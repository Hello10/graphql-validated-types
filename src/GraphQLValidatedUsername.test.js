const Assert = require('assert');

const GraphQLValidatedUsername = require('./GraphQLValidatedUsername');

describe('GraphQLValidatedUsername', ()=> {
  let Username;

  beforeEach(()=> {
    Username = new GraphQLValidatedUsername();
  });

  it('should validate usernames', ()=> {
    const input = 'asdfasdf234';
    Assert.equal(Username.parseValue(input), input);

    Assert.throws(()=> {
      Username.parseValue('~derp@darp---++asdf');
    }, /does not match/);
  });
});
