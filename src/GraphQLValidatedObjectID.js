const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

class GraphQLValidatedObjectID extends GraphQLValidatedScalar {
	constructor (args = {}) {
		if (!args.name) {
			args.name = 'ObjectID'
		}
		super(args);

		this.validator((value)=> {
			return new this.ObjectID(value);
		});
	}

	get ObjectID () {
		let ObjectID = this.constructor._ObjectID;
		if (!ObjectID) {
			throw new Error('ObjectID has not been set');
		}
		return ObjectID;
	}

	static set ObjectID (ObjectID) {
		this._ObjectID = ObjectID;
	}

	validKinds () {
		return [Kind.OBJECT, Kind.STRING];
	}

	validTypes () {
		return ['object', 'string'];
	}

	// overriding base implementation
	_serialize (value) {
		this._ensureValidType(value);
		return value.toHexString();
	}
}

module.exports = GraphQLValidatedObjectID;
