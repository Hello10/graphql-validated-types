const urlRegex = require('url-regex');
const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedURL extends GraphQLValidatedString {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'URL'
		}
		super(args);

		this._exact = true;
		this._strict = true;
		this.setRegex();
	}

	setRegex () {
		this.clearValidators();
		let url_regex = urlRegex({
			exact: this._exact,
			strict: this._strict
		});
		return this.regex(url_regex);
	}

	strict (strict = true) {
		this._strict = strict;
		return this.setRegex();
	}

	exact (exact = true) {
		this._exact = exact;
		return this.setRegex();
	}
}

module.exports = GraphQLValidatedURL;
