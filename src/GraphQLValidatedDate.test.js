const Assert = require('assert');

const GraphQLValidatedDate = require('./GraphQLValidatedDate');

function jsonEquals (a, b) {
  Assert.equal(a.toJSON(), b.toJSON());
}

describe('GraphQLValidatedDate', ()=> {
  let Date_;

  beforeEach(()=> {
    Date_ = new GraphQLValidatedDate();
  });

  it('should parse js date', ()=> {
    const now = new Date();
    Assert.equal(Date_.parseValue(now), now);
  });

  it('should parse unix time', ()=> {
    const now = new Date();
    jsonEquals(Date_.parseValue(now.getTime()), now);
  });

  it('should parse json date string in json format', ()=> {
    const time = '1975-08-19T23:15:30.000Z';
    jsonEquals(Date_.parseValue(time), new Date(time));
  });

  it('should parse json date string in iso format', ()=> {
    const time = new Date();
    jsonEquals(Date_.parseValue(time.toISOString()), time);
  });

  it('should parse json date string toString format', ()=> {
    const time = new Date().toString();
    jsonEquals(Date_.parseValue(time), new Date(time));
  });
});
