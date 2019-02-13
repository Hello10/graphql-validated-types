const Assert = require('assert');

const GraphQLValidatedString = require('./GraphQLValidatedString');

describe('GraphQLValidatedString', ()=> {
	describe('.regex(pattern)', ()=> {
		let Fart;

		beforeEach(()=> {
			Fart = new GraphQLValidatedString({
				name: 'Fart'
			}).regex(/fart/);
		});

		it('should support matching regex', ()=> {
			Assert.equal(Fart.parseValue('omgfart'), 'omgfart');
			Assert.equal(Fart.parseValue('fart'), 'fart');
		});

		it('should throw on non-matching regex', ()=> {
			Assert.throws(()=> {
				Fart.parseValue('honk');
			}, /does not match/);
		});
	});

  describe('.existsIn(arr)', ()=> {
    let Flerp;

    beforeEach(()=> {
      Flerp = new GraphQLValidatedString({
        name: 'Flerp'
      }).existsIn(['Herp', 'Derp']);
    });

    it('should find a value from the array', ()=> {
      Assert.equal(Flerp.parseValue('Derp'), 'Derp');
      Assert.equal(Flerp.parseValue('Herp'), 'Herp');
    });

    it('should throw on a value not in the array', ()=> {
			Assert.throws(()=> {
				Flerp.parseValue('qwerp');
			}, /'qwerp' was not present in array/);
    });
  });

	describe('.length(length)', ()=> {
		let Barfed;

		beforeEach(()=> {
			Barfed = new GraphQLValidatedString({
				name: 'Barfed'
			});
		});

		it('should support min length', ()=> {
			Barfed.length({min: 5});
			Assert.equal(Barfed.parseValue('barfed'), 'barfed');
			Assert.throws(()=> {
				Barfed.parseValue('barf');
			}, /has invalid length/);
		});

		it('should support max length', ()=> {
			Barfed.length({max: 5});
			Assert.equal(Barfed.parseValue('barf'), 'barf');
			Assert.throws(()=> {
				Barfed.parseValue('barfed');
			}, /has invalid length/);
		});

		it('should support min and max length', ()=> {
			Barfed.length({min: 2, max: 5});
			Assert.equal(Barfed.parseValue('barf'), 'barf');
			['b', 'barfed'].forEach((val)=> {
				Assert.throws(()=> {
					Barfed.parseValue(val);
				}, /has invalid length/);
			});
		});

		it('should support exact length', ()=> {
			Barfed.length(4);
			Assert.equal(Barfed.parseValue('barf'), 'barf');
			['bbb', 'bbbbb'].forEach((val)=> {
				Assert.throws(()=> {
					Barfed.parseValue(val);
				}, /has invalid length/);
			});
		})
	});

	describe('.nonempty()', ()=> {
		it('should handle checking for empty strings', ()=> {
		 	const Honk = new GraphQLValidatedString({
				name: 'Honk'
			}).nonempty();

			Assert.equal(Honk.parseValue('abcd'), 'abcd');

			Assert.throws(()=> {
				Honk.parseValue('');
			}, /has invalid length/);
		});
	});

	describe('.trim', ()=> {
		it('should trim input', ()=> {
			const Trim = new GraphQLValidatedString({
				name: 'Trim'
			}).trim();

			const tests = [
				[' abc ', 'abc'],
				[' ab  c', 'ab  c'],
				['abc', 'abc']
			];
			tests.forEach((test)=> {
				let [input, output] = test;
				Assert.equal(Trim.parseValue(input), output, `'${input}' !== '${output}'`);
			});
		});
	});

	describe('.replace(pattern, replacement)', ()=> {
		it('should replace matching sequences in input', ()=> {
			const Replace = new GraphQLValidatedString({
				name: 'Replace'
			}).replace(/b+/, 'b');

			const tests = [
				['abbbc', 'abc'],
				[' abb  c', ' ab  c'],
				['abc', 'abc']
			];
			tests.forEach((test)=> {
				let [input, output] = test;
				Assert.equal(Replace.parseValue(input), output, `'${input}' !== '${output}'`);
			});
		});
	});

	describe('.squish', ()=> {
		it('should trim and remove internal repeated spaces', ()=> {
			const Squish = new GraphQLValidatedString({
				name: 'Squish'
			}).squish();

			const tests = [
				[' abc ', 'abc'],
				[' ab  c', 'ab c'],
				['abc', 'abc']
			];
			tests.forEach((test)=> {
				let [input, output] = test;
				Assert.equal(Squish.parseValue(input), output, `'${input}' !== '${output}'`);
			});
		});
	});

	describe('.truncate(length)', ()=> {
		it('should shorten string to desired length', ()=> {
			const Truncate = new GraphQLValidatedString({
				name: 'Truncate'
			}).truncate(5);

			const tests = [
				['abcd', 'abcd'],
				['abcde', 'abcde'],
				['abcdef', 'abcde']
			];
			tests.forEach((test)=> {
				let [input, output] = test;
				Assert.equal(Truncate.parseValue(input), output, `'${input}' !== '${output}'`);
			});
		});
	});

	describe('.base64()', ()=> {
		it('should handle checking for base64 encoded strings', ()=> {
			const Base64 = new GraphQLValidatedString({
				name: 'Base64'
			}).base64();

			const input = 'aGVsbG8sIHdvcmxkIQ==';
			Assert.equal(Base64.parseValue(input), input);

			Assert.throws(()=> {
				Base64.parseValue('=====');
			}, /does not match/);
		});
	});

	describe('.hex()', ()=> {
		it('should handle checking for hex encoded strings', ()=> {
			const Hex = new GraphQLValidatedString({
				name: 'Hex'
			}).hex();

			const input = 'AAAA123';
			Assert.equal(Hex.parseValue(input), input);

			Assert.throws(()=> {
				Hex.parseValue('=====');
			}, /does not match/);
		});
	});

	describe('.alphanumeric()', ()=> {
		it('should handle checking for alphanumeric strings', ()=> {
			const Alphanumeric = new GraphQLValidatedString({
				name: 'Alphanumeric'
			}).alphanumeric();

			const input = 'Azxy3421';
			Assert.equal(Alphanumeric.parseValue(input), input);

			Assert.throws(()=> {
				Alphanumeric.parseValue('!!!!!');
			}, /does not match/);
		});
	});

	describe('.toUpperCase()', ()=> {
		it('should handle converting to upper case', ()=> {
			let Upper = new GraphQLValidatedString({
				name: 'Upper'
			}).toUpperCase();

			let input = 'Azxy3421';
			Assert.equal(Upper.parseValue(input), 'AZXY3421');
		});
	});

	describe('.toLowerCase()', ()=> {
		it('should handle converting to lower case', ()=> {
			let Lower = new GraphQLValidatedString({
				name: 'Lower'
			}).toLowerCase();

			let input = 'AzXy3421';
			Assert.equal(Lower.parseValue(input), 'azxy3421');
		});
	});

	it('should support multiple constraints and transforms', ()=> {
		const Wowz = new GraphQLValidatedString({
			name: 'Wowz'
		}).trim().toLowerCase().regex(/wowz/).length(4);

		Assert.equal(Wowz.parseValue('  Wowz  '), 'wowz');
		Assert.throws(()=> {
			Wowz.parseValue('wowzwowz');
		}, /Wowz has invalid length/);

		const CompanyName = new GraphQLValidatedString({
			name: 'CompanyName'
		}).squish().length({max: 60});
		Assert.equal(CompanyName.parseValue(' don  keys '), 'don keys');
		Assert.throws(()=> {
			let name = Array(65).join('x');
			CompanyName.parseValue(name);
		}, /CompanyName has invalid length/);

		const Wowzer = new GraphQLValidatedString({
			name: 'Wowzer'
		}).length(5).trim();
		Assert.equal(Wowzer.parseValue('abcde'), 'abcde');

		// trim happens after length check so this fails
		Assert.throws(()=> {
			Wowzer.parseValue('abcde   ');
		}, /Wowzer has invalid length/);
	});

	describe('.default(value)', ()=> {
		const DEFAULT = '000000';

		const HexColor = new GraphQLValidatedString({
			name: 'HexColor',
			description: 'HexColor string'
		}).toUpperCase().hex().length(6).default(DEFAULT);

		it('should default null', ()=> {
			Assert.equal(HexColor.parseValue(null), DEFAULT);
		});

		it('should default undefined', ()=> {
			Assert.equal(HexColor.parseValue(undefined), DEFAULT);
		});

		it('should default empty string', ()=> {
			Assert.equal(HexColor.parseValue(''), DEFAULT);
		});

		it('should not default non-empty string', ()=> {
			Assert.throws(()=> {
				HexColor.parseValue('ABC');
			}, /invalid length/);
		});
	});
});
