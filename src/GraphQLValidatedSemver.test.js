const Assert = require('assert');

const GraphQLValidatedSemver = require('./GraphQLValidatedSemver');

describe('GraphQLValidatedSemver', ()=> {
  let Semver;

  beforeEach(()=> {
    Semver = new GraphQLValidatedSemver();
  });

  it('should validate semvers', ()=> {
    const input = '1.0.2';
    Assert.equal(Semver.parseValue(input), input);

    Assert.throws(()=> {
      Semver.parseValue('~derp@darp---++asdf');
    }, /does not match/);
  });
});
