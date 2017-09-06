# graphql-validated
A collection of GraphQL custom scalars supporting cleanup, validation, and defaults via fluent api.

## Example
### Hex colors
```js
// Holds colors like `FF00FF` and `663399`
const HexColor = new GraphQLValidatedString({
	name: 'HexColor',
	description: 'HexColor string'
}).toUpperCase().hex().length(6).default('000000');
```

## Usage

### [GraphQLValidatedScalar]('./GraphQLValidatedScalar.js')
The base class other types extend. It is an extension of [GraphQLScalarType](https://github.com/graphql/graphql-js/blob/master/src/type/definition.js#L304) and can itself be instantiated as a custom scalar for use as a placeholder, allowing for later implementation of parsing, serialization, validation etc.
```js
const MyPlaceholder = new GraphQLValidatedScalar({
	name: 'MyPlaceholder',
	description: 'Custom scalar MyPlacholder'
});
```

### [GraphQLValidatedString]('./blob/master/src/GraphQLValidatedString.js')

#### Validation
Validation functions will throw `TypeError` unless the value matches criteria

##### `.length(length)`
Requires string to be of specified `length` (if passed number) or `min` and/or `max` (if passed object)
```js
const VariableLength = new GraphQLValidatedString({
	name: 'VariableLength'
}).length({min: 5, max: 10});

Assert.throws(()=> {
	VariableLength.parseValue('abcd');
}, /has invalid length/);

const FixedLength = new GraphQLValidatedString({
	name: 'FixedLength'
}).length(8);

Assert.throws(()=> {
	FixedLength.parseValue('abcde');
}, /has invalid length/);
```

##### `.nonempty()`
Alias for `.length({min: 1})`
```js
const NotEmpty = new GraphQLValidatedString({
	name: 'NotEmpty'
}).nonempty();

Assert.throws(()=> {
	NotEmtpy.parseValue('');
}, /has invalid length/);
```

##### `.regex(pattern)`
Requires value to match `pattern`
```js
const HumanName = new GraphQLValidatedString({
	name: 'HumanName'
}).regex(/([a-zA-Z]{3,30}\s*)+/);

Assert.throws(()=> {
	HumanName.parseValue('aa');
}, /does not match/);
```

##### `.base64()`
Alias for `.regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)`
```js
const Image = new GraphQLValidatedString({
	name: 'Image'
}).base64();

Assert.throws(()=> {
	Image.parseValue('=====');
}, /does not match/);
```

##### `.hex()`
Alias for `.regex(/^[a-f0-9]+$/i)`
```js
const Hex = new GraphQLValidatedString({
	name: 'Hex'
}).hex();

Assert.throws(()=> {
	Hex.parseValue('=====');
}, /does not match/);
```

##### `.alphanumeric()`
Alias for `.regex(/^[a-zA-Z0-9]+$/)`
```js
const Username = new GraphQLValidatedString({
	name: 'Username'
}).alphanumeric();

Assert.throws(()=> {
	Username.parseValue('!!!!!');
}, /does not match/);
```

#### Cleanup
##### `.trim()`
Remove spaces from either side of string
```js
const Trimmed = new GraphQLValidatedString({
	name: 'Trimmed'
}).trim();

Assert.equal(Trimmed.parseValue(' abc '), 'abc');
```

##### `.replace(pattern, replacement)`
Replace `pattern` with `replacement`
```js
const Replace = new GraphQLValidatedString({
	name: 'Replace'
}).replace(/b+/, 'b');

Assert.equal(Replace.parseValue('abbbc'), 'abc');
```

##### `.squish()`
Trim sides and replace repeated spaces with single space
```js
const Squish = new GraphQLValidatedString({
	name: 'Squish'
}).squish();

Assert.equal(Squish.parseValue(' ab  c'), 'ab c');
```

##### `.truncate(length)`
Limit string to maximum `length`
```js
const Truncate = new GraphQLValidatedString({
	name: 'Truncate'
}).truncate(5);

Assert.equal(Truncate.parseValue('abcdef'), 'abcde');
```

##### `.toUpperCase()`
Make string upper case
```js
let Upper = new GraphQLValidatedString({
	name: 'Upper'
}).toUpperCase();

Assert.equal(Upper.parseValue('abcDEF'), 'ABCDEF');
```

##### `.toLowerCase()`
Make string lower case
```js
let Lower = new GraphQLValidatedString({
	name: 'Lower'
}).toLowerCase();

Assert.equal(Upper.parseValue('ABCdef'), 'abcdef');
```

### [GraphQLValidatedEmail]('./blob/master/src/GraphQLValidatedEmail.js')
Extends `GraphQLValidatedString` and validates Email using [email-regex](https://github.com/sindresorhus/email-regex).
```
// exact email address passes
const Email = new GraphQLValidatedEmail();

// any string containing email address passes
const ContainsEmail = new GraphQLValidatedEmail().exact(false);
```

### [GraphQLValidatedURL]('./blob/master/src/GraphQLValidatedURL.js')
Extends `GraphQLValidatedString` and validates URL using [url-regex](https://github.com/kevva/url-regex).
```
// exact URL with protocol passes
const URL = new GraphQLValidatedURL();

// any string containing URL with or without protocol passes
const ContainsURL = new GraphQLValidatedURL().exact(false).strict(false);
```

### [GraphQLValidatedPhoneNumber]('./blob/master/src/GraphQLValidatedPhoneNumber.js')
Extends `GraphQLValidatedString` and validates Phone Number  using [phone-regex](https://github.com/regexhq/phone-regex)
```
// exact phone number passes
const Phone = new GraphQLValidatedPhoneNumber();

// any string containing phone number passes
const ContainsPhone = new GraphQLValidatedPhoneNumber().exact(false);
```

### [GraphQLValidatedIPAddress]('./blob/master/src/GraphQLValidatedIPAddress.js')
Extends `GraphQLValidatedString` and validates IP Address using [ip-regex](https://github.com/sindresorhus/ip-regex).
```
// validates string containing IP Address (either IPV4 or IPV6)
let IPAddress = new GraphQLValidatedIPAddress().exact(false);

// validates string equal to IPV4 Address
let IPV4Address = new GraphQLValidatedIPAddress().v4();

// validates string equal to IPV6 Address
let IPV6Address = new GraphQLValidatedIPAddress().v6();
```

### [GraphQLValidatedNumber]('./blob/master/src/GraphQLValidatedNumber.js')

#### `.min(minimum)`
Require to be at least `minimum`
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).min(10);

Assert.throws(()=> {
	Count.parseValue(9);
}, /below minimum value/);
```

#### `.max(maximum)`
Require to be at least `maximum`
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).max(10);

Assert.throws(()=> {
	Count.parseValue(11);
}, /above maximum value/);
```

#### `.range([minimum, maximum])`
Require to be at least `minimum` and at most `maximum`
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).range([10, 20]);

Assert.throws(()=> {
	Count.parseValue(21);
}, /not within range/);
```

#### `.below(limit)`
Require to be less than `limit`
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).below(10);

Assert.throws(()=> {
	Count.parseValue(10);
}, /not below limit/);
```

#### `.above(limit)`
Require to be more than `limit`
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).above(10);

Assert.throws(()=> {
	Count.parseValue(10);
}, /not above limit/);
```

#### `.between([low, high])`
Require to be more than low and less than high
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).between([10, 20]);

Assert.throws(()=> {
	Count.parseValue(10);
}, /not between limits/);
```

#### `.positive()`
Require number to be greater than zero
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).positive();

Assert.throws(()=> {
	Count.parseValue(0);
}, /not positive/);
```

#### `.negative()`
Require number to be less than zero
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).negative();

Assert.throws(()=> {
	Count.parseValue(0);
}, /not negative/);
```

#### `.nonnegative()`
Require number to be zero or greater
```js
let Count = new GraphQLValidatedNumber({
	name: 'Count'
}).nonnegative();

Assert.throws(()=> {
	Count.parseValue(-1);
}, /negative/);
```

### [GraphQLValidatedInteger]('./blob/master/src/GraphQLValidatedInteger.js')
Extends [GraphQLValidatedNumber]('./blob/master/src/GraphQLValidatedNumber.js') and requires number to be `32-bit` (between `-2147483648` and `2147483647`) and truncates from floats to integers

```js
const Integer = new GraphQLValidatedInteger({
	name: 'Integer'
});

Assert.equal(Integer.parseValue(10.5), 10);
```

### [GraphQLValidatedMoment]('./blob/master/src/GraphQLValidatedMoment.js')
Parses and formats dates using [Moment.js](https://momentjs.com/)

Prior to using, make sure `Moment` is set on the constructor
```js
const Moment = require('moment');
const {GraphQLValidatedMoment} = require('graphql-validated-moment');
GraphQLValidatedMoment.Moment = Moment;
```

#### Parsing
By default, uses Moment's [parsing](https://momentjs.com/docs/#/parsing/) logic to handle [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), [RFC 2822 Date time](https://tools.ietf.org/html/rfc2822#section-3.3), and fall back to `new Date(<input>)`.

```js

const Time = new GraphQLValidatedMoment({
	name: 'Time'
});
const now = new Date();
Assert.equal(Time.parseValue(now).valueOf(), now.getTime());
```

#### `.inputFormat(format)`
Specifies custom input `format`
```js
const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).inputFormat('YYYY-MM-DD HH:mm Z');
let formatted = Time.parseValue('2010-10-20 4:30 +0000').format();
Assert.equal(formatted, '2010-10-19T21:30:00-07:00');
```

#### `.outputFormat(format)`
Specifies custom output `format` for serialization
```js
const year = '2013';
const time = `${year}-02-08`;
const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).outputFormat('YYYY');
const output = Time.serialize(Time.parseValue(time));
Assert.equal(output, year);
```

#### Validators

##### `.before()`
Requires date to be before now
```js
const tomorrow = Moment().add({day: 1});
const next_day = tomorrow.clone().add({day: 1});

const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).before(tomorrow);

Assert.throws(()=> {
	Time.parseValue(next_day);
}, /not before/);
```

##### `.beforeNow()`
Requires date to be before now
```js
const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).beforeNow();

const tomorrow = Moment().add({day: 1});
Assert.throws(()=> {
	Time.parseValue(tomorrow);
}, /not before/);
```

##### `.after()`
Requires date to be before now
```js
const tomorrow = Moment().add({day: 1});
const next_day = tomorrow.clone().add({day: 1});

const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).after(next_day);

Assert.throws(()=> {
	Time.parseValue(tomorrow);
}, /not after/);
```

##### `.afterNow()`
Requires date to be before now
```js
const Time = new GraphQLValidatedMoment({
	name: 'Time'
}).afterNow();

const yesterday = Moment().subtract({day: 1});
Assert.throws(()=> {
	Time.parseValue(yesterday);
}, /not after/);
```

### [GraphQLValidatedObjectID]('./blob/master/src/GraphQLValidatedObjectID.js')
Wrapper on MongoDB's [ObjectID](). Handles parsing 24 char hex string, 12 byte string, or existing ObjectID. Serializes using `.toHexString`

Prior to using, make sure `ObjectID` is set on the constructor
```js
const MongoDB = require('mongodb');
const {GraphQLValidatedObjectID} = require('graphql-validated-moment');
GraphQLValidatedObjectID.ObjectID = MongoDB.ObjectID;

const ObjectID = new GraphQLValidatedObjectID();
const OBJECT_ID_HEX_STRING = '59b035f1485caa25a5505f2d';
const OBJECT_ID_12_BYTE = 'aaaaaaaaaaaa';
const OBJECT_ID_12_BYTE_AS_HEX = '616161616161616161616161';

let oid = ObjectID.parseValue(OBJECT_ID_HEX_STRING);
Assert.equal(oid.toHexString(), OBJECT_ID_HEX_STRING);

oid = new MongoDB.ObjectID();
Assert.equal(ObjectID.parseValue(oid), oid);

oid = ObjectID.parseValue(OBJECT_ID_12_BYTE);
Assert.equal(oid.toHexString(), OBJECT_ID_12_BYTE_AS_HEX);
Assert.equal(ObjectID.serialize(oid), OBJECT_ID_12_BYTE_AS_HEX);
```

## TODO
- support for array and object type validation?

## Notes
This is based on aspects adapted from the following
- https://github.com/graphql/graphql-js/blob/master/src/type/scalars.js
- http://dev.apollodata.com/tools/graphql-tools/scalars.html
- https://github.com/li-kai/graphql-scalar-types
- https://github.com/stylesuxx/graphql-custom-types
- https://github.com/mugli/learning-graphql/blob/master/7.%20Deep%20Dive%20into%20GraphQL%20Type%20System.md
- https://github.com/xpepermint/graphql-type-factory
