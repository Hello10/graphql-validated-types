const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedMoment extends GraphQLValidatedScalar {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'Moment';
		}
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

	validKinds () {
		return [Kind.STRING, Kind.OBJECT, Kind.INT];
	}

	validTypes () {
		return ['object', 'string', 'number'];
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

	// overriding base implementation
	_serialize (moment) {
		const Moment = this.Moment;
		if (!Moment.isMoment(moment)) {
			moment = Moment(moment);
		}
		return moment.format(this.output_format);
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
