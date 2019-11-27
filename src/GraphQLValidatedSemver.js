const semverRegex = require('semver-regex');

const GraphQLValidatedString = require('./GraphQLValidatedString');

class GraphQLValidatedSemver extends GraphQLValidatedString {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'Semver'
		}
		super(args);
		this.setRegex();
	}

	setRegex () {
		this.clearValidators();
		let semver_regex = semverRegex();
		return this.regex(semver_regex);
	}
}

module.exports = GraphQLValidatedSemver;
