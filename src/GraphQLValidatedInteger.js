const GraphQLValidatedNumber = require('./GraphQLValidatedNumber');

const MAXIMUM = 2147483647;
const MINIMUM = -2147483648;

class GraphQLValidatedInteger extends GraphQLValidatedNumber {
	constructor (args) {
		super(args);
		this.validator((value)=> {
			let truncate = (value >= 0) ? Math.floor : Math.ceil;
			return truncate(value);
		});
		this.max(MAXIMUM);
		this.min(MINIMUM);
	}

	validKinds () {
		return [Kind.INT];
	}

	validTypes () {
		return ['number'];
	}
}

GraphQLValidatedInteger.MAXIMUM = MAXIMUM;
GraphQLValidatedInteger.MINIMUM = MINIMUM;

module.exports = GraphQLValidatedInteger;
