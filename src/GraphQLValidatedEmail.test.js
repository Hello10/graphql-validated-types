const Assert = require('assert');

const GraphQLValidatedEmail = require('./GraphQLValidatedEmail');

describe('GraphQLValidatedEmail', ()=> {
  let Email;

  beforeEach(()=> {
    Email = new GraphQLValidatedEmail();
  });

  it('should validate exact emails', ()=> {
    Email.exact();

    const input = 'hello@email.com';
    Assert.equal(Email.parseValue(input), input);

    Assert.throws(()=> {
      Email.parseValue(`${input} blah`);
    }, /does not match/);
  });

  it('should validate inexact emails', ()=> {
    Email.exact(false);

    const input = 'oh hi hello@email.com';
    Assert.equal(Email.parseValue(input), input);

    Assert.throws(()=> {
      Email.parseValue('blah blah blah');
    }, /does not match/);
  });
});
