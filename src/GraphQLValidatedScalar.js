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

	_serialize (value) {
		return value;
	}

	_parseValue (value) {
		return this.validate(value);
	}

	_parseLiteral (ast) {
		return this.validate(ast.value);
	}

	shouldDefault (value) {
		return !value;
	}

	default (_default) {
		this._default = _default;
		return this;
	}

	validate (value) {
		if (this.shouldDefault(value) && this._default) {
			value = this._default;
		}
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
