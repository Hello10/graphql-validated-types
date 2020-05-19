const Assert = require('assert');

const GraphQLValidatedInteger = require('./GraphQLValidatedInteger');

describe('GraphQLValidatedInteger', ()=> {
  let Integer;

  beforeEach(()=> {
    Integer = new GraphQLValidatedInteger({
      name: 'Integer'
    });
  });

  it('should convert float to integer', ()=> {
    Assert.equal(Integer.parseValue(10.5), 10);
    Assert.equal(Integer.parseValue(10), 10);
    Assert.equal(Integer.parseValue(-11.23), -11);
  });

  it('should throw if outside 32 bit range', ()=> {
    Assert.throws(()=> {
      Integer.parseValue(GraphQLValidatedInteger.MAXIMUM + 1);
    }, /above maximum/);

    Assert.throws(()=> {
      Integer.parseValue(GraphQLValidatedInteger.MINIMUM - 1);
    }, /below minimum/);
  });
});
