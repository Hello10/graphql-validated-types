const {Kind} = require('graphql/language');

const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedNumber extends GraphQLValidatedScalar {
  constructor (args = {}) {
    if (!args.name) {
      args.name = 'Number';
    }
    super(args);
    this.validator(Number);
  }

  validKinds () {
    return [Kind.INT, Kind.FLOAT];
  }

  validTypes () {
    return ['number'];
  }

  shouldDefault (value) {
    return super.shouldDefault(value) && value !== 0;
  }

  limit ({valid, description}) {
    return this.validator((num)=> {
      if (!valid(num)) {
        throw new TypeError(`${this.name} is ${description}`);
      }
      return num;
    });
  }

  min (min) {
    return this.limit({
      description: 'below minimum value',
      valid: (num)=> {
        return num >= min;
      }
    });
  }

  max (max) {
    return this.limit({
      description: 'above maximum value',
      valid: (num)=> {
        return num <= max;
      }
    });
  }

  range ([min, max]) {
    return this.limit({
      description: 'not within range',
      valid: (num)=> {
        return num >= min && num <= max;
      }
    });
  }

  below (limit) {
    return this.limit({
      description: 'not below limit',
      valid: (num)=> {
        return num < limit;
      }
    });
  }

  above (limit) {
    return this.limit({
      description: 'not above limit',
      valid: (num)=> {
        return num > limit;
      }
    });
  }

  between ([low, high]) {
    return this.limit({
      description: 'not between limits',
      valid: (num)=> {
        return num > low && num < high;
      }
    });
  }

  positive () {
    return this.limit({
      description: 'not positive',
      valid: (num)=> {
        return num > 0;
      }
    });
  }

  negative () {
    return this.limit({
      description: 'not negative',
      valid: (num)=> {
        return num < 0;
      }
    });
  }

  nonnegative () {
    return this.limit({
      description: 'negative',
      valid: (num)=> {
        return num >= 0;
      }
    });
  }
}

module.exports = GraphQLValidatedNumber;
