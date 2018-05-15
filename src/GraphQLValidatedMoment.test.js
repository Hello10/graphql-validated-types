const Assert = require('assert');

const GraphQLValidatedMoment = require('./GraphQLValidatedMoment');
const Moment = require('moment');

describe('GraphQLValidatedMoment', ()=> {
	describe('When Moment has not been set', ()=> {
		it('should throw an error', ()=> {
			Assert.throws(()=> {
				let Time = new GraphQLValidatedMoment({
					name: 'Time'
				});
				Time.parseValue(new Date());
			}, /Moment has not been set/);
		});
	});

	describe('When Moment has been set', ()=> {
		let Time;

		beforeEach(()=> {
			GraphQLValidatedMoment.Moment = Moment;
			Time = new GraphQLValidatedMoment({
				name: 'Time'
			});
		});

		it('should parse js date', ()=> {
			const now = new Date();
			Assert.equal(Time.parseValue(now).valueOf(), now.getTime());
		});

		it('should parse unix time', ()=> {
			const now = (new Date()).getTime();
			Assert.equal(Time.parseValue(now).valueOf(), now);
		});

		describe('.input_format', ()=> {
			const format = 'YYYY-MM-DD HH:mm Z';

			it('should handle parsing', ()=> {
				Time.inputFormat(format);
				const time = '2010-10-20 4:30 +0000';
				const parsed = Time.parseValue(time).format();
				Assert.equal(parsed, '2010-10-19T21:30:00-07:00');
			});

			it('should throw when input_format is not matched', ()=> {
				Time.inputFormat(format);
				const bad_time = '10/20/2010 4:30 +0000';
				Assert.throws(()=> {
					Time.parseValue(bad_time);
				}, /Time is not valid format/);

			});

			it('should fail to parse invalid date', ()=> {
				const time = 'honkhonk';
				Time.inputFormat('YYYY');
				Assert.throws(()=> {
					Time.parseValue(time);
				}, /Time is not valid format/);
			});
		});

		it('should support custom output format when serializing', ()=> {
			const year = '2013';
			const time = `${year}-02-08`;
			Time.outputFormat('YYYY');
			const output = Time.serialize(Time.parseValue(time));
			Assert.equal(output, year);
		});

		describe('.beforeNow', ()=> {
			beforeEach(()=> {
				Time.beforeNow();
			});

			it('should accept moments before now', ()=> {
				const yesterday = Moment().subtract({day: 1});
				Assert.doesNotThrow(()=> {
					Time.parseValue(yesterday);
				});
			});

			it('should not accept moments after now', ()=> {
				const tomorrow = Moment().add({day: 1});
				Assert.throws(()=> {
					Time.parseValue(tomorrow);
				}, /not before/);
			});
		});

		describe('.afterNow', ()=> {
			beforeEach(()=> {
				Time.afterNow();
			});

			it('should accept moments after now', ()=> {
				const tomorrow = Moment().add({day: 1});
				Assert.doesNotThrow(()=> {
					Time.parseValue(tomorrow);
				});
			});

			it('should not accept moments after now', ()=> {
				const yesterday = Moment().subtract({day: 1});
				Assert.throws(()=> {
					Time.parseValue(yesterday);
				}, /not after/);
			});
		});

		describe('.before', ()=> {
			const today = Moment();
			const yesterday = today.clone().subtract({day: 1});
			const day_before_yesterday = yesterday.clone().subtract({day: 1});

			beforeEach(()=> {
				Time.before(yesterday);
			});

			it('should accept moments before specified time', ()=> {
				Assert.doesNotThrow(()=> {
					Time.parseValue(day_before_yesterday);
				});
			});

			it('should reject moments after specified time', ()=> {
				Assert.throws(()=> {
					Time.parseValue(today);
				}, /not before/);
			});
		});

		describe('.after', ()=> {
			const today = Moment();
			const yesterday = today.clone().subtract({day: 1});
			const day_before_yesterday = yesterday.clone().subtract({day: 1});

			beforeEach(()=> {
				Time.after(yesterday);
			});

			it('should accept moments after specified time', ()=> {
				Assert.doesNotThrow(()=> {
					Time.parseValue(today);
				});
			});

			it('should reject moments before specified time', ()=> {
				Assert.throws(()=> {
					Time.parseValue(day_before_yesterday);
				}, /not after/);
			});
		});
	});
});
