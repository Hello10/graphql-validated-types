const {Kind} = require('graphql/language');

const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedString extends GraphQLValidatedScalar {
  constructor (args = {}) {
    if (!args.name) {
      args.name = 'String';
    }
    super(args);
    this.validator(String);
  }

  validKinds () {
    return [Kind.STRING];
  }

  validTypes () {
    return ['string'];
  }

  regex (pattern) {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern);
    }

    return this.validator((str)=> {
      if (pattern.test(str)) {
        return str;
      } else {
        throw new TypeError(`${this.name} does not match ${pattern}: ${str}`);
      }
    });
  }

  existsIn (arr) {
    return this.validator((str)=> {
      const result = arr.find((el)=> {
        return el === str;
      });
      if (result) {
        return str;
      } else {
        throw new TypeError(`'${str}' was not present in array`);
      }
    });
  }

  length (length) {
    return this.validator((str)=> {
      let valid;
      if (length.min || length.max) {
        const {
          min = -Infinity,
          max = Infinity
        } = length;
        valid = (str.length >= min) && (str.length <= max);
      } else {
        valid = (str.length === length);
      }

      if (valid) {
        return str;
      } else {
        throw new TypeError(`${this.name} has invalid length: ${str}`);
      }
    });
  }

  nonempty () {
    return this.length({min: 1});
  }

  trim () {
    return this.validator((str)=> {
      return str.trim();
    });
  }

  replace (pattern, replacement) {
    return this.validator((str)=> {
      return str.replace(pattern, replacement);
    });
  }

  squish () {
    this.trim();
    return this.replace(/\s+/g, ' ');
  }

  truncate (length) {
    return this.validator((str)=> {
      return str.substring(0, length);
    });
  }

  // https://stackoverflow.com/a/475217/178043
  base64 () {
    return this.regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
  }

  hex () {
    return this.regex(/^[a-f0-9]+$/i);
  }

  alphanumeric () {
    return this.regex(/^[a-zA-Z0-9]+$/);
  }

  toUpperCase () {
    return this.validator((str)=> {
      return str.toUpperCase();
    });
  }

  toLowerCase () {
    return this.validator((str)=> {
      return str.toLowerCase();
    });
  }
}

module.exports = GraphQLValidatedString;
