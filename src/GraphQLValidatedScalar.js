const { GraphQLScalarType } = require('graphql');

class GraphQLValidatedScalar extends GraphQLScalarType {
	constructor({name, description = 'custom scalar type'}) {
		super({
			name,
			description,
			serialize: (value)=> {
				return this._serialize(value);
			},
			parseValue: (value)=> {
				return this._parseValue(value);
			},
			parseLiteral: (ast)=> {
				return this._parseLiteral(ast);
			}
		});
		this._default = null;
		this.clearValidators();
	}

	clearValidators () {
		this.validators = [];
	}

	validKinds () {
		return null;
	}

	validTypes () {
		return null;
	}

	_serialize (value) {
		return value;
	}

	throwTypeError () {
		const types = this.validTypes();
		let description = 'invalid type';
		if (types) {
			description = `not one of [${types}]`
		}
		throw new TypeError(`${this.name} is ${description}`);
	}

	_parseValue (value) {
		value = this.ensureDefault(value);
		const types = this.validTypes();
		if (types) {
			const type = typeof value;
			if (!types.includes(type)) {
				this.throwTypeError();
			}
		}

		return this.validate(value);
	}

	_parseLiteral (ast) {
		value = this.ensureDefault(value);
		const {kind, value} = ast;

		const kinds = this.validKinds();
		if (kinds) {
			const types = this.validTypes();
			if (!kinds.includes(kind)) {
				this.throwTypeError();
			}
		}

		return this.validate(value);
	}

	ensureDefault (value) {
		if (this.shouldDefault(value) && this._default) {
			value = this._default;
		}
		return value;
	}

	shouldDefault (value) {
		return !value;
	}

	default (_default) {
		this._default = _default;
		return this;
	}

	validate (value) {
  	return this.validators.reduce((result, validator) => {
			return validator(result);
		}, value);
	}

	validator (validator) {
		let new_validators = Array.isArray(validator) ? validator : [validator];
		this.validators = [...this.validators, ...new_validators];
		return this;
	}
}

module.exports = GraphQLValidatedScalar;
