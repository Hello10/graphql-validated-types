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

	// overriding base implementation
	_serialize (value) {
		return value.toHexString();
	}
}

module.exports = GraphQLValidatedObjectID;
