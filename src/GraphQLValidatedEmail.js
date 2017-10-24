const emailRegex = require('email-regex');
const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedEmail extends GraphQLValidatedString {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'Email'
		}
		super(args);

		this._exact = true;
		this.setRegex();
	}

	setRegex () {
		this.clearValidators();
		let email_regex = emailRegex({
			exact: this._exact
		});
		return this.regex(email_regex);
	}

	exact (exact = true) {
		this._exact = exact;
		return this.setRegex();
	}
}

module.exports = GraphQLValidatedEmail;
