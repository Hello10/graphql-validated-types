const Assert = require('assert');

const GraphQLValidatedScalar = require('./GraphQLValidatedScalar');

describe('GraphQLValidatedScalar', ()=> {
  describe('.validator(fn)', ()=> {
    let VowelCountButNoLetterE;

    beforeEach(()=> {
      VowelCountButNoLetterE = new GraphQLValidatedScalar({
        name: 'VowelCountButNoLetterE'
      }).validator((value)=> {
        if (value.match(/e/)) {
          throw new Error('E is not allowed');
        }
        return value;
      }).validator((value)=> {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        let count = 0;
        for (let i = 0; i < value.length; i++) {
          const letter = value[i];
          if (vowels.indexOf(letter) !== -1) {
            count++;
          }
        }
        return count;
      });
    });

    it('should validate and transfor input', ()=> {
      const count = VowelCountButNoLetterE.parseValue('animals');
      Assert.equal(count, 3);
    });

    it('should throw when validator throws', ()=> {
      Assert.throws(()=> {
        VowelCountButNoLetterE.parseValue('forever');
      }, /E is not allowed/);
    });
  });
});
