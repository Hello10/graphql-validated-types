const {Kind} = require('graphql/language');

const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedDate extends GraphQLValidatedScalar {
  constructor (args = {}) {
    if (!args.name) {
      args.name = 'Date';
    }
    super(args);

    this.validator((value)=> {
      switch (typeof value) {
        case 'object':
          if (value.constructor !== Date) {
            throw new TypeError(`${this.name} is not object of type Date`);
          }
          return value;
        case 'number':
        case 'string':
          return new Date(value);
        default:
          return this.throwTypeError();
      }
    });
  }

  validKinds () {
    return [Kind.STRING, Kind.OBJECT, Kind.INT];
  }

  validTypes () {
    return ['object', 'string', 'number'];
  }

  _serialize (value) {
    return super._serialize(value).toJSON();
  }
}

module.exports = GraphQLValidatedDate;
