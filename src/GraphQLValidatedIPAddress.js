const ipRegex = require('ip-regex');
const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedIPAddress extends GraphQLValidatedString {
  constructor (args = {}) {
    if (!args.name) {
      args.name = 'IPAddress';
    }
    super(args);

    this.type = null;
    this._exact = true;
    this.setRegex();
  }

  setRegex () {
    this.clearValidators();
    let regex = ipRegex;
    if (this.type) {
      regex = regex[this.type];
    }
    const ip_regex = regex({
      exact: this._exact
    });
    return this.regex(ip_regex);
  }

  exact (exact = true) {
    this._exact = exact;
    return this.setRegex();
  }

  v4 () {
    this.type = 'v4';
    return this.setRegex();
  }

  v6 () {
    this.type = 'v6';
    return this.setRegex();
  }
}

module.exports = GraphQLValidatedIPAddress;
