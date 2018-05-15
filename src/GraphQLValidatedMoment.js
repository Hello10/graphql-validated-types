const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedMoment extends GraphQLValidatedScalar {
	constructor (args) {
		super(args);

		this.input_format = null;
		this.output_format = null;

		this.validator((value)=> {
			let Moment = this.Moment;
			let moment = Moment(value, this.input_format);
			if (!moment.isValid()) {
				throw new TypeError(`${this.name} is not valid format`);
			}
			return moment;
		});
	}

	get Moment () {
		let Moment = this.constructor._Moment;
		if (!Moment) {
			throw new Error('Moment has not been set');
		}
		return Moment;
	}

	static set Moment (Moment) {
		this._Moment = Moment;
	}

	inputFormat (format) {
		this.input_format = format;
		return this;
	}

	outputFormat (format) {
		this.output_format = format;
		return this;
	}

	// parse value as string instead of moment object to store in database
	parseValue(value) {
		return this.validate(value).format();
	}
	
	// parse value as string instead of moment object to store in database
	parseLiteral(ast) {
		return this.validate(ast.value).format();
	}

	// overriding base implementation
	serialize (moment) {
		// return moment.format(this.output_format);
		return this.Moment(moment).format(this.output_format)
	}

	before (before) {
		return this.validator((moment)=> {
			if (!moment.isBefore(before)) {
				throw new TypeError(`${this.name}:${moment} is not before ${before}`);
			}
			return moment;
		});
	}

	beforeNow () {
		return this.before();
	}

	after (after) {
		return this.validator((moment)=> {
			if (!moment.isAfter(after)) {
				throw new TypeError(`${this.name}:${moment} is not after ${after}`);
			}
			return moment;
		});
	}

	afterNow () {
		return this.after();
	}
}

module.exports = GraphQLValidatedMoment;
