const Assert = require('assert');
const MongoDB = require('mongodb');

const GraphQLValidatedObjectID = require('./GraphQLValidatedObjectID');

const OBJECT_ID_HEX_STRING = '59b035f1485caa25a5505f2d';

describe('GraphQLValidatedObjectID', ()=> {
  describe('When ObjectID has not been set', ()=> {
    it('should throw an error', ()=> {
      Assert.throws(()=> {
        const ObjectID = new GraphQLValidatedObjectID();
        ObjectID.parseValue(OBJECT_ID_HEX_STRING);
      }, /ObjectID has not been set/);
    });
  });

  describe('When ObjectID has been set', ()=> {
    let ObjectID;

    beforeEach(()=> {
      GraphQLValidatedObjectID.ObjectID = MongoDB.ObjectID;
      ObjectID = new GraphQLValidatedObjectID();
    });

    it('should parse 24 hex string', ()=> {
      const oid = ObjectID.parseValue(OBJECT_ID_HEX_STRING);
      Assert.equal(oid.toHexString(), OBJECT_ID_HEX_STRING);
    });

    it('should parse ObjectID', ()=> {
      const oid = new MongoDB.ObjectID();
      Assert.equal(ObjectID.parseValue(oid), oid);
    });

    it('should parse 12 byte string', ()=> {
      const oid = ObjectID.parseValue('aaaaaaaaaaaa');
      Assert.equal(oid.toHexString(), '616161616161616161616161');
    });

    it('should fail to parse invalid ObjectID', ()=> {
      Assert.throws(()=> {
        ObjectID.parseValue('abcd');
      }, /Argument passed in must be a single String of 12 bytes or a string of 24 hex characters/);
    });

    it('should serialize to hex string', ()=> {
      const oid = ObjectID.parseValue('aaaaaaaaaaaa');
      Assert.equal(ObjectID.serialize(oid), '616161616161616161616161');
    });
  });
});
