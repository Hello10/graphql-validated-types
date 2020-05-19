const Assert = require('assert');

const GraphQLValidatedIPAddress = require('./GraphQLValidatedIPAddress');

describe('GraphQLValidatedIPAddress', ()=> {
  let IPAddress;

  beforeEach(()=> {
    IPAddress = new GraphQLValidatedIPAddress();
  });

  it('should validate exact IP', ()=> {
    IPAddress.exact();

    const input = '10.11.12.13';
    Assert.equal(IPAddress.parseValue(input), input);

    Assert.throws(()=> {
      IPAddress.parseValue(`${input} blah`);
    }, /does not match/);
  });

  it('should validate inexact IP', ()=> {
    IPAddress.exact(false);

    const input = 'i love 10.11.12.13';
    Assert.equal(IPAddress.parseValue(input), input);

    Assert.throws(()=> {
      IPAddress.parseValue('blah blah blah');
    }, /does not match/);
  });

  it('should validate exact IPv4', ()=> {
    IPAddress.v4().exact();

    const input = '10.11.12.13';
    Assert.equal(IPAddress.parseValue(input), input);

    Assert.throws(()=> {
      IPAddress.parseValue(`${input} blah`);
    }, /does not match/);

    Assert.throws(()=> {
      IPAddress.parseValue('1:2:3:4:5:6:7:8');
    }, /does not match/);
  });

  it('should validate exact IPv6', ()=> {
    IPAddress.v6().exact();

    const input = '1:2:3:4:5:6:7:8';
    Assert.equal(IPAddress.parseValue(input), input);

    Assert.throws(()=> {
      IPAddress.parseValue(`${input} blah`);
    }, /does not match/);

    Assert.throws(()=> {
      IPAddress.parseValue('10.11.12.13');
    }, /does not match/);
  });
});
