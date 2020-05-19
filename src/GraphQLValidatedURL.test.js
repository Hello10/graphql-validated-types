const Assert = require('assert');

const GraphQLValidatedURL = require('./GraphQLValidatedURL');

describe('GraphQLValidatedURL', ()=> {
  let URL;

  beforeEach(()=> {
    URL = new GraphQLValidatedURL();
  });

  it('should validate strict and exact urls', ()=> {
    URL.strict().exact();

    const input = 'http://github.com';
    Assert.equal(URL.parseValue(input), input);

    Assert.throws(()=> {
      URL.parseValue(`${input} blah`);
    }, /does not match/);
  });

  it('should validate nonstrict and inexact urls', ()=> {
    URL.strict(false).exact(false);

    const input = 'i love github.com';
    Assert.equal(URL.parseValue(input), input);

    Assert.throws(()=> {
      URL.parseValue('blah blah blah');
    }, /does not match/);
  });
});
