const usernameRegex = require('regex-username');
const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedUsername extends GraphQLValidatedString {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'Username'
		}
		super(args);
		this.setRegex();
	}

	setRegex () {
		this.clearValidators();
		let username_regex = usernameRegex();
		return this.regex(username_regex);
	}
}

module.exports = GraphQLValidatedUsername;
