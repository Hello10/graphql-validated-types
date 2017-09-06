const Assert = require('assert');

const GraphQLValidatedNumber = require('./GraphQLValidatedNumber');

describe('GraphQLValidatedNumber', ()=> {
	let Number;

	beforeEach(()=> {
		Number = new GraphQLValidatedNumber({
			name: 'Number'
		});
	});

	it('should throw on empty string', ()=> {
		const input = '';

		Assert.throws(()=> {
			Number.parseValue(input);
		}, /is empty string/);
	});

	it('should support min value', ()=> {
		Number.min(10);

		Assert.equal(Number.parseValue(11), 11);

		Assert.throws(()=> {
			Number.parseValue(9);
		}, /below minimum value/);
	});

	it('should support max value', ()=> {
		Number.max(10);

		Assert.equal(Number.parseValue(10), 10);

		Assert.throws(()=> {
			Number.parseValue(11);
		}, /above maximum value/);
	});

	it('should support min and max values', ()=> {
		Number.max(10).min(5);

		Assert.equal(Number.parseValue(8), 8);

		Assert.throws(()=> {
			Number.parseValue(12);
		}, /above maximum value/)

		Assert.throws(()=> {
			Number.parseValue(3);
		}, /below minimum value/)
	});

	it('should support range', ()=> {
		Number.range([10, 20]);

		Assert.equal(Number.parseValue(12), 12);

		Assert.throws(()=> {
			Number.parseValue(24);
		}, /Number is not within range/);
	});

	it('should support lower limit', ()=> {
		Number.above(10);

		Assert.equal(Number.parseValue(11), 11);

		Assert.throws(()=> {
			Number.parseValue(10);
		}, /not above limit/);
	});

	it('should support upper limit', ()=> {
		Number.below(10);

		Assert.equal(Number.parseValue(9), 9);

		Assert.throws(()=> {
			Number.parseValue(10);
		}, /not below limit/);
	});

	it('should support upper and lower limits', ()=> {
		Number.above(2).below(10);

		Assert.equal(Number.parseValue(9), 9);

		Assert.throws(()=> {
			Number.parseValue(2);
		}, /not above limit/);

		Assert.throws(()=> {
			Number.parseValue(10);
		}, /not below limit/);
	});

	it('should support within', ()=> {
		Number.between([10, 20]);

		Assert.equal(Number.parseValue(10.1), 10.1);

		Assert.throws(()=> {
			Number.parseValue(20);
		}, /Number is not between limits/);
	});

	it('should support positive', ()=> {
		Number.positive();

		Assert.equal(Number.parseValue(9), 9);

		Assert.throws(()=> {
			Number.parseValue(-2);
		}, /not positive/);
	});

	it('should support negative', ()=> {
		Number.negative();

		Assert.equal(Number.parseValue(-9), -9);

		Assert.throws(()=> {
			Number.parseValue(0);
		}, /not negative/);
	});

	it('should support nonnegative', ()=> {
		Number.nonnegative();

		Assert.equal(Number.parseValue(0), 0);

		Assert.throws(()=> {
			Number.parseValue(-2);
		}, /negative/);
	});

	describe('.default(value)', ()=> {
		const DEFAULT = 10;

		const SometimesTen = new GraphQLValidatedNumber({
			name: 'SometimesTen'
		}).range([8, 16]).default(DEFAULT);

		it('should default null', ()=> {
			Assert.equal(SometimesTen.parseValue(null), DEFAULT);
		})

		it('should default undefined', ()=> {
			Assert.equal(SometimesTen.parseValue(undefined), DEFAULT);
		});

		it('should not default when numeric passed', ()=> {
			Assert.throws(()=> {
				SometimesTen.parseValue(40);
			}, /not within range/);
		});

		it('should not default when 0 passed', ()=> {
			Assert.throws(()=> {
				SometimesTen.parseValue(0);
			}, /not within range/);
		});
	});
});
