const phoneRegex = require('phone-regex');

const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedPhoneNumber extends GraphQLValidatedString {
  constructor (args = {}) {
    if (!args.name) {
      args.name = 'Phone';
    }
    super(args);

    this._exact = true;
    this.setRegex();
  }

  setRegex () {
    this.clearValidators();
    const phone_regex = phoneRegex({
      exact: this._exact
    });
    return this.regex(phone_regex);
  }

  exact (exact = true) {
    this._exact = exact;
    return this.setRegex();
  }
}

module.exports = GraphQLValidatedPhoneNumber;
