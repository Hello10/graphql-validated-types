const Assert = require('assert');

const GraphQLValidatedPhoneNumber = require('./GraphQLValidatedPhoneNumber');

describe('GraphQLValidatedPhoneNumber', ()=> {
  let PhoneNumber;

  beforeEach(()=> {
    PhoneNumber = new GraphQLValidatedPhoneNumber();
  });

  it('should validate exact phone numbers', ()=> {
    PhoneNumber.exact();

    const input = '1-800-555-1234';
    Assert.equal(PhoneNumber.parseValue(input), input);

    Assert.throws(()=> {
      PhoneNumber.parseValue(`${input} blah`);
    }, /does not match/);
  });

  it('should validate inexact phone numbers', ()=> {
    PhoneNumber.exact(false);

    const input = 'i love 1-800-555-1234';
    Assert.equal(PhoneNumber.parseValue(input), input);

    Assert.throws(()=> {
      PhoneNumber.parseValue('blah blah blah');
    }, /does not match/);
  });
});
