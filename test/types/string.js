'use strict';

// Load modules

const Lab = require('lab');
const Joi = require('../..');
const Helper = require('../helper');


// Declare internals

const internals = {};


// Test shortcuts

const { describe, it, expect } = exports.lab = Lab.script();


process.env.TZ = 'utc'; // Needed for timezone sensitive tests


describe('string', () => {

    it('should throw an exception if arguments were passed.', (done) => {

        expect(
            () => Joi.string('invalid argument.')
        ).to.throw('Joi.string() does not allow arguments.');

        done();
    });

    it('fails on boolean', (done) => {

        const schema = Joi.string();
        Helper.validate(schema, [
            [true, false, null, {
                message: '"value" must be a string',
                details: [{
                    message: '"value" must be a string',
                    path: [],
                    type: 'string.base',
                    context: { value: true, label: 'value', key: undefined }
                }]
            }],
            [false, false, null, {
                message: '"value" must be a string',
                details: [{
                    message: '"value" must be a string',
                    path: [],
                    type: 'string.base',
                    context: { value: false, label: 'value', key: undefined }
                }]
            }]
        ], done);
    });

    it('fails on integer', (done) => {

        const schema = Joi.string();
        Helper.validate(schema, [
            [123, false, null, {
                message: '"value" must be a string',
                details: [{
                    message: '"value" must be a string',
                    path: [],
                    type: 'string.base',
                    context: { value: 123, label: 'value', key: undefined }
                }]
            }],
            [0, false, null, {
                message: '"value" must be a string',
                details: [{
                    message: '"value" must be a string',
                    path: [],
                    type: 'string.base',
                    context: { value: 0, label: 'value', key: undefined }
                }]
            }],
            ['123', true],
            ['0', true]
        ], done);
    });

    describe('insensitive', () => {

        it('avoids unnecessary cloning when called twice', (done) => {

            const schema = Joi.string().insensitive();
            expect(schema.insensitive()).to.shallow.equal(schema);
            done();
        });
    });

    describe('valid()', () => {

        it('validates case sensitive values', (done) => {

            Helper.validate(Joi.string().valid('a', 'b'), [
                ['a', true],
                ['b', true],
                ['A', false, null, {
                    message: '"value" must be one of [a, b]',
                    details: [{
                        message: '"value" must be one of [a, b]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['a', 'b'], label: 'value', key: undefined }
                    }]
                }],
                ['B', false, null, {
                    message: '"value" must be one of [a, b]',
                    details: [{
                        message: '"value" must be one of [a, b]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['a', 'b'], label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates case insensitive values', (done) => {

            Helper.validate(Joi.string().valid('a', 'b').insensitive(), [
                ['a', true],
                ['b', true],
                ['A', true],
                ['B', true],
                [4, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 4, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates case insensitive values with non-strings', (done) => {

            Helper.validate(Joi.string().valid('a', 'b', 5).insensitive(), [
                ['a', true],
                ['b', true],
                ['A', true],
                ['B', true],
                [4, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 4, label: 'value', key: undefined }
                    }]
                }],
                [5, true]
            ], done);
        });
    });

    describe('invalid()', () => {

        it('inverts case sensitive values', (done) => {

            Helper.validate(Joi.string().invalid('a', 'b'), [
                ['a', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['b', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['A', true],
                ['B', true]
            ], done);
        });

        it('inverts case insensitive values', (done) => {

            Helper.validate(Joi.string().invalid('a', 'b').insensitive(), [
                ['a', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['b', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['A', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['B', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('min()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.string().min('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', (done) => {

            expect(() => {

                Joi.string().min(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', (done) => {

            expect(() => {

                Joi.string().min(-1);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', (done) => {

            const schema = Joi.string().min(2, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', true],
                ['a', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'a',
                            encoding: 'utf8',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('accepts references as min length', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.string().min(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'a' }, false, null, {
                    message: 'child "b" fails because ["b" length must be at least 2 characters long]',
                    details: [{
                        message: '"b" length must be at least 2 characters long',
                        path: ['b'],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'a',
                            encoding: 'utf8',
                            label: 'b',
                            key: 'b'
                        }
                    }]
                }]
            ], done);
        });

        it('accepts references as min length within a when', (done) => {

            const schema = Joi.object({
                a: Joi.string().required(),
                b: Joi.number().required(),
                c: Joi.number().required().when('a', {
                    is: Joi.string().min(Joi.ref('b')), // a.length >= b
                    then: Joi.number().valid(0)
                })
            });

            Helper.validate(schema, [
                [{ a: 'abc', b: 4, c: 42 }, true],
                [{ a: 'abc', b: 3, c: 0 }, true],
                [{ a: 'abc', b: 3, c: 42 }, false, null, {
                    message: 'child "c" fails because ["c" must be one of [0]]',
                    details: [{
                        message: '"c" must be one of [0]',
                        path: ['c'],
                        type: 'any.allowOnly',
                        context: { valids: [0], label: 'c', key: 'c' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as min length', (done) => {

            const schema = Joi.object({ b: Joi.string().min(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }, {
                    message: 'child "b" fails because ["b" length must be at least 2 characters long]',
                    details: [{
                        message: '"b" length must be at least 2 characters long',
                        path: ['b'],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'a',
                            encoding: 'utf8',
                            label: 'b',
                            key: 'b'
                        }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.any(), b: Joi.string().min(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ b: Joi.string().min(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('max()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.string().max('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', (done) => {

            expect(() => {

                Joi.string().max(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', (done) => {

            expect(() => {

                Joi.string().max(-1);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', (done) => {

            const schema = Joi.string().max(1, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', false, null, {
                    message: '"value" length must be less than or equal to 1 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 1 characters long',
                        path: [],
                        type: 'string.max',
                        context: { limit: 1, value: '\u00bd', encoding: 'utf8', label: 'value', key: undefined }
                    }]
                }],
                ['a', true]
            ], done);
        });

        it('accepts references as min length', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.string().max(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'three' }, false, null, {
                    message: 'child "b" fails because ["b" length must be less than or equal to 2 characters long]',
                    details: [{
                        message: '"b" length must be less than or equal to 2 characters long',
                        path: ['b'],
                        type: 'string.max',
                        context: {
                            limit: 2,
                            value: 'three',
                            encoding: 'utf8',
                            label: 'b',
                            key: 'b'
                        }
                    }]
                }]
            ], done);
        });

        it('accepts context references as min length', (done) => {

            const schema = Joi.object({ b: Joi.string().max(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'three' }, false, { context: { a: 2 } }, {
                    message: 'child "b" fails because ["b" length must be less than or equal to 2 characters long]',
                    details: [{
                        message: '"b" length must be less than or equal to 2 characters long',
                        path: ['b'],
                        type: 'string.max',
                        context: {
                            limit: 2,
                            value: 'three',
                            encoding: 'utf8',
                            label: 'b',
                            key: 'b'
                        }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.any(), b: Joi.string().max(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ b: Joi.string().max(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('creditCard()', () => {

        it('should validate credit card', (done) => {

            const t = Joi.string().creditCard();
            t.validate('4111111111111112', (err, value) => {

                expect(err.message).to.equal('"value" must be a credit card');

                Helper.validate(t, [
                    ['378734493671000', true],  // american express
                    ['371449635398431', true],  // american express
                    ['378282246310005', true],  // american express
                    ['341111111111111', true],  // american express
                    ['5610591081018250', true], // australian bank
                    ['5019717010103742', true], // dankort pbs
                    ['38520000023237', true],   // diners club
                    ['30569309025904', true],   // diners club
                    ['6011000990139424', true], // discover
                    ['6011111111111117', true], // discover
                    ['6011601160116611', true], // discover
                    ['3566002020360505', true], // jbc
                    ['3530111333300000', true], // jbc
                    ['5105105105105100', true], // mastercard
                    ['5555555555554444', true], // mastercard
                    ['5431111111111111', true], // mastercard
                    ['6331101999990016', true], // switch/solo paymentech
                    ['4222222222222', true],    // visa
                    ['4012888888881881', true], // visa
                    ['4111111111111111', true], // visa
                    ['4111111111111112', false, null, {
                        message: '"value" must be a credit card',
                        details: [{
                            message: '"value" must be a credit card',
                            path: [],
                            type: 'string.creditCard',
                            context: { value: '4111111111111112', label: 'value', key: undefined }
                        }]
                    }],
                    [null, false, null, {
                        message: '"value" must be a string',
                        details: [{
                            message: '"value" must be a string',
                            path: [],
                            type: 'string.base',
                            context: { value: null, label: 'value', key: undefined }
                        }]
                    }]
                ], done);
            });
        });
    });

    describe('length()', () => {

        it('throws when limit is not a number', (done) => {

            expect(() => {

                Joi.string().length('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', (done) => {

            expect(() => {

                Joi.string().length(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', (done) => {

            expect(() => {

                Joi.string().length(-42);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', (done) => {

            const schema = Joi.string().length(2, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', true],
                ['a', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: { limit: 2, value: 'a', encoding: 'utf8', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('accepts references as length', (done) => {

            const schema = Joi.object({ a: Joi.number(), b: Joi.string().length(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'a' }, false, null, {
                    message: 'child "b" fails because ["b" length must be 2 characters long]',
                    details: [{
                        message: '"b" length must be 2 characters long',
                        path: ['b'],
                        type: 'string.length',
                        context: { limit: 2, value: 'a', encoding: 'utf8', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('accepts context references as length', (done) => {

            const schema = Joi.object({ b: Joi.string().length(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }, {
                    message: 'child "b" fails because ["b" length must be 2 characters long]',
                    details: [{
                        message: '"b" length must be 2 characters long',
                        path: ['b'],
                        type: 'string.length',
                        context: { limit: 2, value: 'a', encoding: 'utf8', label: 'b', key: 'b' }
                    }]
                }],
                [{ b: 'a' }, false, { context: { a: 2 } }, {
                    message: 'child "b" fails because ["b" length must be 2 characters long]',
                    details: [{
                        message: '"b" length must be 2 characters long',
                        path: ['b'],
                        type: 'string.length',
                        context: { limit: 2, value: 'a', encoding: 'utf8', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.any(), b: Joi.string().length(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });

        it('errors if context reference is not a number', (done) => {

            const schema = Joi.object({ a: Joi.any(), b: Joi.string().length(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, {
                    message: 'child "b" fails because ["b" references "a" which is not a number]',
                    details: [{
                        message: '"b" references "a" which is not a number',
                        path: ['b'],
                        type: 'string.ref',
                        context: { ref: 'a', label: 'b', key: 'b' }
                    }]
                }]
            ], done);
        });
    });

    describe('email()', () => {

        it('throws when options are not an object', (done) => {

            expect(() => {

                const emailOptions = true;
                Joi.string().email(emailOptions);
            }).to.throw('email options must be an object');
            done();
        });

        it('throws when checkDNS option is enabled', (done) => {

            expect(() => {

                const emailOptions = { checkDNS: true };
                Joi.string().email(emailOptions);
            }).to.throw('checkDNS option is not supported');
            done();
        });

        it('throws when tldWhitelist is not an array or object', (done) => {

            expect(() => {

                const emailOptions = { tldWhitelist: 'domain.tld' };
                Joi.string().email(emailOptions);
            }).to.throw('tldWhitelist must be an array or object');
            done();
        });

        it('throws when minDomainAtoms is not a number', (done) => {

            expect(() => {

                const emailOptions = { minDomainAtoms: '1' };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('throws when minDomainAtoms is not an integer', (done) => {

            expect(() => {

                const emailOptions = { minDomainAtoms: 1.2 };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('throws when minDomainAtoms is not positive', (done) => {

            expect(() => {

                const emailOptions = { minDomainAtoms: 0 };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('does not throw when minDomainAtoms is a positive integer', (done) => {

            expect(() => {

                const emailOptions = { minDomainAtoms: 1 };
                Joi.string().email(emailOptions);
            }).to.not.throw();
            done();
        });

        it('throws when errorLevel is not an integer or boolean', (done) => {

            expect(() => {

                const emailOptions = { errorLevel: 1.2 };
                Joi.string().email(emailOptions);
            }).to.throw('errorLevel must be a non-negative integer or boolean');
            done();
        });

        it('throws when errorLevel is negative', (done) => {

            expect(() => {

                const emailOptions = { errorLevel: -1 };
                Joi.string().email(emailOptions);
            }).to.throw('errorLevel must be a non-negative integer or boolean');
            done();
        });

        it('does not throw when errorLevel is 0', (done) => {

            expect(() => {

                const emailOptions = { errorLevel: 0 };
                Joi.string().email(emailOptions);
            }).to.not.throw();
            done();
        });

        it('validates email', (done) => {

            const schema = Joi.string().email();
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['"joe"@example.com', true],
                ['êjness@something.com', true],
                ['@iaminvalid.com', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: '@iaminvalid.com', label: 'value', key: undefined }
                    }]
                }],
                ['joe@[IPv6:2a00:1450:4001:c02::1b]', true],
                ['12345678901234567890123456789012345678901234567890123456789012345@walmartlabs.com', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: '12345678901234567890123456789012345678901234567890123456789012345@walmartlabs.com', label: 'value', key: undefined }
                    }]
                }],
                ['123456789012345678901234567890123456789012345678901234567890@12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345.toolong.com', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: '123456789012345678901234567890123456789012345678901234567890@12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345.toolong.com', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates email with tldWhitelist as array', (done) => {

            const schema = Joi.string().email({ tldWhitelist: ['com', 'org'] });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@example.org', true],
                ['joe@example.edu', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe@example.edu', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates email with tldWhitelist as object', (done) => {

            const schema = Joi.string().email({ tldWhitelist: { com: true, org: true } });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@example.org', true],
                ['joe@example.edu', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe@example.edu', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates email with minDomainAtoms', (done) => {

            const schema = Joi.string().email({ minDomainAtoms: 4 });
            Helper.validate(schema, [
                ['joe@example.com', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe@example.com', label: 'value', key: undefined }
                    }]
                }],
                ['joe@www.example.com', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe@www.example.com', label: 'value', key: undefined }
                    }]
                }],
                ['joe@sub.www.example.com', true]
            ], done);
        });

        it('validates email with errorLevel as boolean', (done) => {

            let schema = Joi.string().email({ errorLevel: false });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', true],
                ['joe', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe', label: 'value', key: undefined }
                    }]
                }]
            ]);

            schema = Joi.string().email({ errorLevel: true });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', true],
                ['joe@', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe@', label: 'value', key: undefined }
                    }]
                }],
                ['joe', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates email with errorLevel as integer', (done) => {

            const schema = Joi.string().email({ errorLevel: 10 });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', true],
                ['joe', false, null, {
                    message: '"value" must be a valid email',
                    details: [{
                        message: '"value" must be a valid email',
                        path: [],
                        type: 'string.email',
                        context: { value: 'joe', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates email with a friendly error message', (done) => {

            const schema = { item: Joi.string().email() };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err).to.be.an.error('child "item" fails because ["item" must be a valid email]');
                expect(err.details).to.equal([{
                    message: '"item" must be a valid email',
                    path: ['item'],
                    type: 'string.email',
                    context: { value: 'something', label: 'item', key: 'item' }
                }]);
                done();
            });
        });
    });

    describe('hostname()', () => {

        it('validates hostnames', (done) => {

            const schema = Joi.string().hostname();
            Helper.validate(schema, [
                ['www.example.com', true],
                ['domain.local', true],
                ['3domain.local', true],
                ['hostname', true],
                ['host:name', false, null, {
                    message: '"value" must be a valid hostname',
                    details: [{
                        message: '"value" must be a valid hostname',
                        path: [],
                        type: 'string.hostname',
                        context: { value: 'host:name', label: 'value', key: undefined }
                    }]
                }],
                ['-', false, null, {
                    message: '"value" must be a valid hostname',
                    details: [{
                        message: '"value" must be a valid hostname',
                        path: [],
                        type: 'string.hostname',
                        context: { value: '-', label: 'value', key: undefined }
                    }]
                }],
                ['2387628', true],
                ['01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789', false, null, {
                    message: '"value" must be a valid hostname',
                    details: [{
                        message: '"value" must be a valid hostname',
                        path: [],
                        type: 'string.hostname',
                        context: { value: '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789', label: 'value', key: undefined }
                    }]
                }],
                ['::1', true],
                ['0:0:0:0:0:0:0:1', true],
                ['0:?:0:0:0:0:0:1', false, null, {
                    message: '"value" must be a valid hostname',
                    details: [{
                        message: '"value" must be a valid hostname',
                        path: [],
                        type: 'string.hostname',
                        context: { value: '0:?:0:0:0:0:0:1', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('normalize()', () => {

        // The characters chosen for the "original" string below are such that
        // it and its four normalization forms are all different from each other
        // See: http://www.unicode.org/faq/normalization.html#6
        // and: http://www.unicode.org/reports/tr15/#Singletons_Figure

        const normalizations = {
            original: '\u03D3 \u212B',   // 'ϓ Å'
            NFC: '\u03D3 \u00C5',        // 'ϓ Å'
            NFD: '\u03D2\u0301 A\u030A', // 'ϓ Å'
            NFKC: '\u038E \u00C5',       // 'Ύ Å'
            NFKD: '\u03A5\u0301 A\u030A' // 'Ύ Å'
        };

        it('throws when normalization form is invalid', (done) => {

            expect(() => {

                Joi.string().normalize('NFCD');
            }).to.throw('normalization form must be one of NFC, NFD, NFKC, NFKD');
            done();
        });

        it('only allow strings that are in NFC form', (done) => {

            const schema = Joi.string().normalize('NFC');

            Helper.validateOptions(schema, [
                [normalizations.original, false, null, {
                    message: '"value" must be unicode normalized in the NFC form',
                    details: [{
                        message: '"value" must be unicode normalized in the NFC form',
                        path: [],
                        type: 'string.normalize',
                        context: {
                            form: 'NFC',
                            value: normalizations.original,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [normalizations.NFC, true]
            ], { convert: false }, done);
        });

        it('only allow strings that are in NFD form', (done) => {

            const schema = Joi.string().normalize('NFD');

            Helper.validateOptions(schema, [
                [normalizations.original, false, null, {
                    message: '"value" must be unicode normalized in the NFD form',
                    details: [{
                        message: '"value" must be unicode normalized in the NFD form',
                        path: [],
                        type: 'string.normalize',
                        context: {
                            form: 'NFD',
                            value: normalizations.original,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [normalizations.NFD, true]
            ], { convert: false }, done);
        });

        it('only allow strings that are in NFKC form', (done) => {

            const schema = Joi.string().normalize('NFKC');

            Helper.validateOptions(schema, [
                [normalizations.original, false, null, {
                    message: '"value" must be unicode normalized in the NFKC form',
                    details: [{
                        message: '"value" must be unicode normalized in the NFKC form',
                        path: [],
                        type: 'string.normalize',
                        context: {
                            form: 'NFKC',
                            value: normalizations.original,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [normalizations.NFKC, true]
            ], { convert: false }, done);
        });

        it('only allow strings that are in NFKD form', (done) => {

            const schema = Joi.string().normalize('NFKD');

            Helper.validateOptions(schema, [
                [normalizations.original, false, null, {
                    message: '"value" must be unicode normalized in the NFKD form',
                    details: [{
                        message: '"value" must be unicode normalized in the NFKD form',
                        path: [],
                        type: 'string.normalize',
                        context: {
                            form: 'NFKD',
                            value: normalizations.original,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [normalizations.NFKD, true]
            ], { convert: false }, done);
        });

        it('normalizes string using NFC before validation', (done) => {

            Joi.string().normalize('NFC').validate(normalizations.original, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(normalizations.NFC);
                done();
            });
        });

        it('normalizes string using NFD before validation', (done) => {

            Joi.string().normalize('NFD').validate(normalizations.original, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(normalizations.NFD);
                done();
            });
        });

        it('normalizes string using NFKC before validation', (done) => {

            Joi.string().normalize('NFKC').validate(normalizations.original, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(normalizations.NFKC);
                done();
            });
        });

        it('normalizes string using NFKD before validation', (done) => {

            Joi.string().normalize('NFKD').validate(normalizations.original, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(normalizations.NFKD);
                done();
            });
        });

        it('should default to NFC form', (done) => {

            const schema = Joi.string().normalize();
            schema.validate(normalizations.original, (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal(normalizations.NFC);
                done();
            });
        });

        // The below tests use the composed and decomposed form
        // of the 'ñ' character

        it('should work in combination with min', (done) => {

            const baseSchema = Joi.string().min(2);

            baseSchema.normalize('NFD').validate('\u00F1', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('n\u0303');

                baseSchema.normalize('NFC').validate('n\u0303', (err2, value2) => {

                    expect(err2).to.be.an.error('"value" length must be at least 2 characters long');
                    expect(err2.details).to.equal([{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: '\u00F1',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]);

                    done();
                });
            });
        });

        it('should work in combination with max', (done) => {

            const baseSchema = Joi.string().max(1);

            baseSchema.normalize('NFC').validate('n\u0303', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('\u00F1');

                baseSchema.normalize('NFD').validate('\u00F1', (err2, value2) => {

                    expect(err2).to.be.an.error('"value" length must be less than or equal to 1 characters long');
                    expect(err2.details).to.equal([{
                        message: '"value" length must be less than or equal to 1 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 1,
                            value: 'n\u0303',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]);

                    done();
                });
            });
        });

        it('composition should work in combination with length', (done) => {

            const schema = Joi.string().length(2).normalize('NFC');

            Helper.validate(schema, [
                ['\u00F1', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 2,
                            value: '\u00F1',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['n\u0303', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 2,
                            value: '\u00F1',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['\u00F1\u00F1', true],
                ['\u00F1n\u0303', true],
                ['n\u0303n\u0303', true]
            ], done);
        });

        it('decomposition should work in combination with length', (done) => {

            const schema = Joi.string().length(2).normalize('NFD');

            Helper.validate(schema, [
                ['\u00F1\u00F1', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 2,
                            value: 'n\u0303n\u0303',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['\u00F1n\u0303', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 2,
                            value: 'n\u0303n\u0303',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['n\u0303n\u0303', false, null, {
                    message: '"value" length must be 2 characters long',
                    details: [{
                        message: '"value" length must be 2 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 2,
                            value: 'n\u0303n\u0303',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['\u00F1', true],
                ['n\u0303', true]
            ], done);
        });

        it('should work in combination with lowercase', (done) => {

            const baseSchema = Joi.string().lowercase();

            baseSchema.normalize('NFC').validate('N\u0303', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('\u00F1');

                baseSchema.normalize('NFD').validate('\u00D1', (err2, value2) => {

                    expect(err2).to.not.exist();
                    expect(value2).to.equal('n\u0303');

                    done();
                });
            });
        });

        it('should work in combination with uppercase', (done) => {

            const baseSchema = Joi.string().uppercase();

            baseSchema.normalize('NFC').validate('n\u0303', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('\u00D1');

                baseSchema.normalize('NFD').validate('\u00F1', (err2, value2) => {

                    expect(err2).to.not.exist();
                    expect(value2).to.equal('N\u0303');

                    done();
                });
            });
        });
    });

    describe('lowercase()', () => {

        it('only allows strings that are entirely lowercase', (done) => {

            const schema = Joi.string().lowercase();
            Helper.validateOptions(schema, [
                ['this is all lowercase', true],
                ['5', true],
                ['lower\tcase', true],
                ['Uppercase', false, null, {
                    message: '"value" must only contain lowercase characters',
                    details: [{
                        message: '"value" must only contain lowercase characters',
                        path: [],
                        type: 'string.lowercase',
                        context: { value: 'Uppercase', label: 'value', key: undefined }
                    }]
                }],
                ['MixEd cAsE', false, null, {
                    message: '"value" must only contain lowercase characters',
                    details: [{
                        message: '"value" must only contain lowercase characters',
                        path: [],
                        type: 'string.lowercase',
                        context: { value: 'MixEd cAsE', label: 'value', key: undefined }
                    }]
                }],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('coerce string to lowercase before validation', (done) => {

            const schema = Joi.string().lowercase();
            schema.validate('UPPER TO LOWER', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('upper to lower');
                done();
            });
        });

        it('should work in combination with a trim', (done) => {

            const schema = Joi.string().lowercase().trim();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should work in combination with a replacement', (done) => {

            const schema = Joi.string().lowercase().replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a\r b\n c', true, null, 'a b c'],
                ['A\t B  C', true, null, 'a b c'],
                ['ABC', true, null, 'abc'],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('uppercase()', () => {

        it('only allow strings that are entirely uppercase', (done) => {

            const schema = Joi.string().uppercase();
            Helper.validateOptions(schema, [
                ['THIS IS ALL UPPERCASE', true],
                ['5', true],
                ['UPPER\nCASE', true],
                ['lOWERCASE', false, null, {
                    message: '"value" must only contain uppercase characters',
                    details: [{
                        message: '"value" must only contain uppercase characters',
                        path: [],
                        type: 'string.uppercase',
                        context: { value: 'lOWERCASE', label: 'value', key: undefined }
                    }]
                }],
                ['MixEd cAsE', false, null, {
                    message: '"value" must only contain uppercase characters',
                    details: [{
                        message: '"value" must only contain uppercase characters',
                        path: [],
                        type: 'string.uppercase',
                        context: { value: 'MixEd cAsE', label: 'value', key: undefined }
                    }]
                }],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('coerce string to uppercase before validation', (done) => {

            const schema = Joi.string().uppercase();
            schema.validate('lower to upper', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('LOWER TO UPPER');
                done();
            });
        });

        it('works in combination with a forced trim', (done) => {

            const schema = Joi.string().uppercase().trim();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('works in combination with a forced replacement', (done) => {

            const schema = Joi.string().uppercase().replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a\r b\n c', true, null, 'A B C'],
                ['A\t B  C', true, null, 'A B C'],
                ['ABC', true, null, 'ABC'],
                [1, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: 1, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('trim()', () => {

        it('only allow strings that have no leading or trailing whitespace', (done) => {

            const schema = Joi.string().trim();
            Helper.validateOptions(schema, [
                [' something', false, null, {
                    message: '"value" must not have leading or trailing whitespace',
                    details: [{
                        message: '"value" must not have leading or trailing whitespace',
                        path: [],
                        type: 'string.trim',
                        context: { value: ' something', label: 'value', key: undefined }
                    }]
                }],
                ['something ', false, null, {
                    message: '"value" must not have leading or trailing whitespace',
                    details: [{
                        message: '"value" must not have leading or trailing whitespace',
                        path: [],
                        type: 'string.trim',
                        context: { value: 'something ', label: 'value', key: undefined }
                    }]
                }],
                ['something\n', false, null, {
                    message: '"value" must not have leading or trailing whitespace',
                    details: [{
                        message: '"value" must not have leading or trailing whitespace',
                        path: [],
                        type: 'string.trim',
                        context: { value: 'something\n', label: 'value', key: undefined }
                    }]
                }],
                ['some thing', true],
                ['something', true]
            ], { convert: false }, done);
        });

        it('removes leading and trailing whitespace before validation', (done) => {

            const schema = Joi.string().trim();
            schema.validate(' trim this ', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('trim this');
                done();
            });
        });

        it('removes leading and trailing whitespace before validation', (done) => {

            const schema = Joi.string().trim().allow('');
            schema.validate('     ', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('');
                done();
            });
        });

        it('should work in combination with min', (done) => {

            const schema = Joi.string().min(4).trim();
            Helper.validate(schema, [
                [' a ', false, null, {
                    message: '"value" length must be at least 4 characters long',
                    details: [{
                        message: '"value" length must be at least 4 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 4,
                            value: 'a',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abc ', false, null, {
                    message: '"value" length must be at least 4 characters long',
                    details: [{
                        message: '"value" length must be at least 4 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 4,
                            value: 'abc',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with max', (done) => {

            const schema = Joi.string().max(4).trim();
            Helper.validate(schema, [
                [' abcde ', false, null, {
                    message: '"value" length must be less than or equal to 4 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 4 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 4,
                            value: 'abcde',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abc ', true],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with length', (done) => {

            const schema = Joi.string().length(4).trim();
            Helper.validate(schema, [
                [' ab ', false, null, {
                    message: '"value" length must be 4 characters long',
                    details: [{
                        message: '"value" length must be 4 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 4,
                            value: 'ab',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abc ', false, null, {
                    message: '"value" length must be 4 characters long',
                    details: [{
                        message: '"value" length must be 4 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 4,
                            value: 'abc',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with a case change', (done) => {

            const schema = Joi.string().trim().lowercase();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true]
            ], done);
        });
    });

    describe('replace()', () => {

        it('successfully replaces the first occurrence of the expression', (done) => {

            const schema = Joi.string().replace(/\s+/, ''); // no "g" flag
            Helper.validateOptions(schema, [
                ['\tsomething', true, null, 'something'],
                ['something\r', true, null, 'something'],
                ['something  ', true, null, 'something'],
                ['some  thing', true, null, 'something'],
                ['so me thing', true, null, 'some thing'] // first occurrence!
            ], { convert: true }, done);
        });

        it('successfully replaces all occurrences of the expression', (done) => {

            const schema = Joi.string().replace(/\s+/g, ''); // has "g" flag
            Helper.validateOptions(schema, [
                ['\tsomething', true, null, 'something'],
                ['something\r', true, null, 'something'],
                ['something  ', true, null, 'something'],
                ['some  thing', true, null, 'something'],
                ['so me thing', true, null, 'something']
            ], { convert: true }, done);
        });

        it('successfully replaces all occurrences of a string pattern', (done) => {

            const schema = Joi.string().replace('foo', 'X'); // has "g" flag
            Helper.validateOptions(schema, [
                ['foobarfoobazfoo', true, null, 'XbarXbazX']
            ], { convert: true }, done);
        });

        it('successfully replaces multiple times', (done) => {

            const schema = Joi.string().replace(/a/g, 'b').replace(/b/g, 'c');
            schema.validate('a quick brown fox', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('c quick crown fox');
                done();
            });
        });

        it('should work in combination with trim', (done) => {

            // The string below is the name "Yamada Tarou" separated by a
            // carriage return, a "full width" ideographic space and a newline

            const schema = Joi.string().trim().replace(/\s+/g, ' ');
            schema.validate(' \u5C71\u7530\r\u3000\n\u592A\u90CE ', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('\u5C71\u7530 \u592A\u90CE');
                done();
            });
        });

        it('should work in combination with min', (done) => {

            const schema = Joi.string().min(4).replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['   a   ', false, null, {
                    message: '"value" length must be at least 4 characters long',
                    details: [{
                        message: '"value" length must be at least 4 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 4,
                            value: ' a ',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['abc    ', true, null, 'abc '],
                ['a\t\rbc', true, null, 'a bc']
            ], done);
        });

        it('should work in combination with max', (done) => {

            const schema = Joi.string().max(5).replace(/ CHANGE ME /g, '-b-');
            Helper.validate(schema, [
                ['a CHANGE ME c', true, null, 'a-b-c'],
                ['a-b-c', true, null, 'a-b-c'] // nothing changes here!
            ], done);
        });

        it('should work in combination with length', (done) => {

            const schema = Joi.string().length(5).replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a    bc', false, null, {
                    message: '"value" length must be 5 characters long',
                    details: [{
                        message: '"value" length must be 5 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 5,
                            value: 'a bc',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['a\tb\nc', true, null, 'a b c']
            ], done);
        });

    });

    describe('regex()', () => {

        it('should not include a pattern name by default', (done) => {

            const schema = Joi.string().regex(/[a-z]+/).regex(/[0-9]+/);
            schema.validate('abcd', (err, value) => {

                expect(err).to.be.an.error('"value" with value "abcd" fails to match the required pattern: /[0-9]+/');
                expect(err.details).to.equal([{
                    message: '"value" with value "abcd" fails to match the required pattern: /[0-9]+/',
                    path: [],
                    type: 'string.regex.base',
                    context: {
                        name: undefined,
                        pattern: /[0-9]+/,
                        value: 'abcd',
                        label: 'value',
                        key: undefined
                    }
                }]);
                done();
            });
        });

        it('should include a pattern name if specified', (done) => {

            const schema = Joi.string().regex(/[a-z]+/, 'letters').regex(/[0-9]+/, 'numbers');
            schema.validate('abcd', (err, value) => {

                expect(err).to.be.an.error('"value" with value "abcd" fails to match the numbers pattern');
                expect(err.details).to.equal([{
                    message: '"value" with value "abcd" fails to match the numbers pattern',
                    path: [],
                    type: 'string.regex.name',
                    context: {
                        name: 'numbers',
                        pattern: /[0-9]+/,
                        value: 'abcd',
                        label: 'value',
                        key: undefined
                    }
                }]);
                done();
            });
        });

        it('should include a pattern name in options object', (done) => {

            const schema = Joi.string().regex(/[a-z]+/, { name: 'letters' }).regex(/[0-9]+/, { name: 'numbers' });
            schema.validate('abcd', (err, value) => {

                expect(err).to.be.an.error('"value" with value "abcd" fails to match the numbers pattern');
                expect(err.details).to.equal([{
                    message: '"value" with value "abcd" fails to match the numbers pattern',
                    path: [],
                    type: 'string.regex.name',
                    context: {
                        name: 'numbers',
                        pattern: /[0-9]+/,
                        value: 'abcd',
                        label: 'value',
                        key: undefined
                    }
                }]);
                done();
            });
        });

        it('should "invert" regex pattern if specified in options object', (done) => {

            const schema = Joi.string().regex(/[a-z]/, { invert: true });
            Helper.validate(schema, [
                ['0123456789', true],
                ['abcdefg', false, null, {
                    message: '"value" with value "abcdefg" matches the inverted pattern: /[a-z]/',
                    details: [{
                        message: '"value" with value "abcdefg" matches the inverted pattern: /[a-z]/',
                        path: [],
                        type: 'string.regex.invert.base',
                        context: {
                            name: undefined,
                            pattern: /[a-z]/,
                            value: 'abcdefg',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('should include inverted pattern name if specified', (done) => {

            const schema = Joi.string().regex(/[a-z]/, {
                name  : 'lowercase',
                invert: true
            });
            Helper.validate(schema, [
                ['0123456789', true],
                ['abcdefg', false, null, {
                    message: '"value" with value "abcdefg" matches the inverted lowercase pattern',
                    details: [{
                        message: '"value" with value "abcdefg" matches the inverted lowercase pattern',
                        path: [],
                        type: 'string.regex.invert.name',
                        context: {
                            name: 'lowercase',
                            pattern: /[a-z]/,
                            value: 'abcdefg',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });
    });

    describe('ip()', () => {

        const prepareIps = function (ips) {

            return function (success, message = '', version = ['ipv4', 'ipv6']) {

                return ips.map((ip) => [ip, success, null, !success && message ? {
                    message,
                    details: [{
                        message,
                        path: [],
                        type:  /versions/.test(message) ? 'string.ipVersion' : 'string.ip',
                        context: (() => {

                            const context = {
                                value: ip,
                                cidr: /(\w+) CIDR/.exec(message)[1],
                                label: 'value',
                                key: undefined
                            };

                            if (/versions/.test(message)) {
                                context.version = version;
                            }

                            return context;
                        })()
                    }]
                } : ip]);
            };
        };

        const invalidIPs = function (message, version) {

            return prepareIps([
                'ASDF',
                '192.0.2.16:80/30',
                '192.0.2.16a',
                'qwerty',
                '127.0.0.1:8000',
                'ftp://www.example.com',
                'Bananas in pajamas are coming down the stairs'
            ])(false, message, version);
        };

        const invalidIPv4s = function (message, version) {

            return prepareIps([
                '0.0.0.0/33',
                '256.0.0.0/0',
                '255.255.255.256/32',
                '255.255.255.255/64',
                '255.255.255.255/128',
                '255.255.255.255/255',
                '256.0.0.0',
                '255.255.255.256'
            ])(false, message, version);
        };

        const invalidIPv6s = function (message, version) {

            return prepareIps([
                '1080:0:0:0:8:800:200C:417G/33',
                '1080:0:0:0:8:800:200C:417G',
                'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/129',
                'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/255'
            ])(false, message, version);
        };

        const invalidIPvFutures = function (message, version) {

            return prepareIps([
                'v1.09#/33',
                'v1.09#',
                'v1.09azAZ-._~!$&\'()*+,;=:/129',
                'v1.09azAZ-._~!$&\'()*+,;=:/255'
            ])(false, message, version);
        };

        const validIPv4sWithCidr = prepareIps([
            '0.0.0.0/32',
            '255.255.255.255/0',
            '127.0.0.1/0',
            '192.168.2.1/0',
            '0.0.0.3/2',
            '0.0.0.7/3',
            '0.0.0.15/4',
            '0.0.0.31/5',
            '0.0.0.63/6',
            '0.0.0.127/7',
            '01.020.030.100/7',
            '0.0.0.0/0',
            '00.00.00.00/0',
            '000.000.000.000/32'
        ]);

        const validIPv4sWithoutCidr = prepareIps([
            '0.0.0.0',
            '255.255.255.255',
            '127.0.0.1',
            '192.168.2.1',
            '0.0.0.3',
            '0.0.0.7',
            '0.0.0.15',
            '0.0.0.31',
            '0.0.0.63',
            '0.0.0.127',
            '01.020.030.100',
            '0.0.0.0',
            '00.00.00.00',
            '000.000.000.000'
        ]);

        const validIPv6sWithCidr = prepareIps([
            '2001:db8::7/32',
            'a:b:c:d:e::1.2.3.4/13',
            'a:b:c:d:e::1.2.3.4/64',
            'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/0',
            'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/32',
            'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/128',
            '1080:0:0:0:8:800:200C:417A/27'
        ]);

        const validIPv6sWithoutCidr = prepareIps([
            '2001:db8::7',
            'a:b:c:d:e::1.2.3.4',
            'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210',
            'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210',
            '1080:0:0:0:8:800:200C:417A',
            '::1:2:3:4:5:6:7',
            '::1:2:3:4:5:6',
            '1::1:2:3:4:5:6',
            '::1:2:3:4:5',
            '1::1:2:3:4:5',
            '2:1::1:2:3:4:5',
            '::1:2:3:4',
            '1::1:2:3:4',
            '2:1::1:2:3:4',
            '3:2:1::1:2:3:4',
            '::1:2:3',
            '1::1:2:3',
            '2:1::1:2:3',
            '3:2:1::1:2:3',
            '4:3:2:1::1:2:3',
            '::1:2',
            '1::1:2',
            '2:1::1:2',
            '3:2:1::1:2',
            '4:3:2:1::1:2',
            '5:4:3:2:1::1:2',
            '::1',
            '1::1',
            '2:1::1',
            '3:2:1::1',
            '4:3:2:1::1',
            '5:4:3:2:1::1',
            '6:5:4:3:2:1::1',
            '::',
            '1::',
            '2:1::',
            '3:2:1::',
            '4:3:2:1::',
            '5:4:3:2:1::',
            '6:5:4:3:2:1::',
            '7:6:5:4:3:2:1::'
        ]);

        const validIPvFuturesWithCidr = prepareIps(['v1.09azAZ-._~!$&\'()*+,;=:/32','v1.09azAZ-._~!$&\'()*+,;=:/128']);

        const validIPvFuturesWithoutCidr = prepareIps(['v1.09azAZ-._~!$&\'()*+,;=:']);

        it('should validate all ip addresses with optional CIDR by default', (done) => {

            const schema = Joi.string().ip();
            const message = '"value" must be a valid ip address with a optional CIDR';
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs(message))
                .concat(invalidIPv4s(message))
                .concat(invalidIPv6s(message))
                .concat(invalidIPvFutures(message)), done);
        });

        it('should validate all ip addresses with an optional CIDR', (done) => {

            const schema = Joi.string().ip({ cidr: 'optional' });
            const message = '"value" must be a valid ip address with a optional CIDR';
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs(message))
                .concat(invalidIPv4s(message))
                .concat(invalidIPv6s(message))
                .concat(invalidIPvFutures(message)), done);
        });

        it('should validate all ip addresses with a required CIDR', (done) => {

            const schema = Joi.string().ip({ cidr: 'required' });
            const message = '"value" must be a valid ip address with a required CIDR';
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(false, message))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(false, message))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(false, message))
                .concat(invalidIPs(message))
                .concat(invalidIPv4s(message))
                .concat(invalidIPv6s(message))
                .concat(invalidIPvFutures(message)), done);
        });

        it('should validate all ip addresses with a forbidden CIDR', (done) => {

            const schema = Joi.string().ip({ cidr: 'forbidden' });
            const message = '"value" must be a valid ip address with a forbidden CIDR';
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(false, message))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(false, message))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(false, message))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs(message))
                .concat(invalidIPv4s(message))
                .concat(invalidIPv6s(message))
                .concat(invalidIPvFutures(message)), done);
        });

        it('throws when options is not an object', (done) => {

            expect(() => {

                Joi.string().ip(42);
            }).to.throw('options must be an object');
            done();
        });

        it('throws when options.cidr is not a string', (done) => {

            expect(() => {

                Joi.string().ip({ cidr: 42 });
            }).to.throw('cidr must be a string');
            done();
        });

        it('throws when options.cidr is not a valid value', (done) => {

            expect(() => {

                Joi.string().ip({ cidr: '42' });
            }).to.throw('cidr must be one of required, optional, forbidden');
            done();
        });

        it('throws when options.version is an empty array', (done) => {

            expect(() => {

                Joi.string().ip({ version: [] });
            }).to.throw('version must have at least 1 version specified');
            done();
        });

        it('throws when options.version is not a string', (done) => {

            expect(() => {

                Joi.string().ip({ version: 42 });
            }).to.throw('version at position 0 must be a string');
            done();
        });

        it('throws when options.version is not a valid value', (done) => {

            expect(() => {

                Joi.string().ip({ version: '42' });
            }).to.throw('version at position 0 must be one of ipv4, ipv6, ipvfuture');
            done();
        });

        it('validates ip with a friendly error message', (done) => {

            const schema = { item: Joi.string().ip() };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err).to.be.an.error('child "item" fails because ["item" must be a valid ip address with a optional CIDR]');
                expect(err.details).to.equal([{
                    message: '"item" must be a valid ip address with a optional CIDR',
                    path: ['item'],
                    type: 'string.ip',
                    context: {
                        value: 'something',
                        cidr: 'optional',
                        label: 'item',
                        key: 'item'
                    }
                }]);
                done();
            });
        });

        it('validates ip and cidr presence with a friendly error message', (done) => {

            const schema = { item: Joi.string().ip({ cidr: 'required' }) };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err).to.be.an.error('child "item" fails because ["item" must be a valid ip address with a required CIDR]');
                expect(err.details).to.equal([{
                    message: '"item" must be a valid ip address with a required CIDR',
                    path: ['item'],
                    type: 'string.ip',
                    context: {
                        value: 'something',
                        cidr: 'required',
                        label: 'item',
                        key: 'item'
                    }
                }]);
                done();
            });
        });

        it('validates custom ip version and cidr presence with a friendly error message', (done) => {

            const schema = { item: Joi.string().ip({ version: 'ipv4', cidr: 'required' }) };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err).to.be.an.error('child "item" fails because ["item" must be a valid ip address of one of the following versions [ipv4] with a required CIDR]');
                expect(err.details).to.equal([{
                    message: '"item" must be a valid ip address of one of the following versions [ipv4] with a required CIDR',
                    path: ['item'],
                    type: 'string.ipVersion',
                    context: {
                        value: 'something',
                        cidr: 'required',
                        version: ['ipv4'],
                        label: 'item',
                        key: 'item'
                    }
                }]);
                done();
            });
        });

        describe('ip({ version: "ipv4" })', () => {

            it('should validate all ipv4 addresses with a default CIDR strategy', (done) => {

                const version = 'ipv4';
                const schema = Joi.string().ip({ version });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv4 addresses with an optional CIDR', (done) => {

                const version = 'ipv4';
                const schema = Joi.string().ip({ version, cidr: 'optional' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv4 addresses with a required CIDR', (done) => {

                const version = 'ipv4';
                const schema = Joi.string().ip({ version, cidr: 'required' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4] with a required CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv4 addresses with a forbidden CIDR', (done) => {

                const version = 'ipv4';
                const schema = Joi.string().ip({ version, cidr: 'forbidden' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });
        });

        describe('ip({ version: "ipv6" })', () => {

            it('should validate all ipv6 addresses with a default CIDR strategy', (done) => {

                const version = 'ipv6';
                const schema = Joi.string().ip({ version });
                const message = '"value" must be a valid ip address of one of the following versions [ipv6] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv6 addresses with an optional CIDR', (done) => {

                const version = 'ipv6';
                const schema = Joi.string().ip({ version, cidr: 'optional' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv6] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv6 addresses with a required CIDR', (done) => {

                const version = 'ipv6';
                const schema = Joi.string().ip({ version, cidr: 'required' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv6] with a required CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipv6 addresses with a forbidden CIDR', (done) => {

                const version = 'ipv6';
                const schema = Joi.string().ip({ version, cidr: 'forbidden' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv6] with a forbidden CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });
        });

        describe('ip({ version: "ipvfuture" })', () => {

            it('should validate all ipvfuture addresses with a default CIDR strategy', (done) => {

                const version = 'ipvfuture';
                const schema = Joi.string().ip({ version });
                const message = '"value" must be a valid ip address of one of the following versions [ipvfuture] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipvfuture addresses with an optional CIDR', (done) => {

                const version = 'ipvfuture';
                const schema = Joi.string().ip({ version, cidr: 'optional' });
                const message = '"value" must be a valid ip address of one of the following versions [ipvfuture] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipvfuture addresses with a required CIDR', (done) => {

                const version = 'ipvfuture';
                const schema = Joi.string().ip({ version, cidr: 'required' });
                const message = '"value" must be a valid ip address of one of the following versions [ipvfuture] with a required CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(false, message, [version]))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });

            it('should validate all ipvfuture addresses with a forbidden CIDR', (done) => {

                const version = 'ipvfuture';
                const schema = Joi.string().ip({ version, cidr: 'forbidden' });
                const message = '"value" must be a valid ip address of one of the following versions [ipvfuture] with a forbidden CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message, [version]))
                    .concat(validIPv4sWithoutCidr(false, message, [version]))
                    .concat(validIPv6sWithCidr(false, message, [version]))
                    .concat(validIPv6sWithoutCidr(false, message, [version]))
                    .concat(validIPvFuturesWithCidr(false, message, [version]))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs(message, [version]))
                    .concat(invalidIPv4s(message, [version]))
                    .concat(invalidIPv6s(message, [version]))
                    .concat(invalidIPvFutures(message, [version])), done);
            });
        });

        describe('ip({ version: [ "ipv4", "ipv6" ] })', () => {

            it('should validate all ipv4 and ipv6 addresses with a default CIDR strategy', (done) => {

                const schema = Joi.string().ip({ version: ['ipv4', 'ipv6'] });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4, ipv6] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message))
                    .concat(validIPvFuturesWithoutCidr(false, message))
                    .concat(invalidIPs(message))
                    .concat(invalidIPv4s(message))
                    .concat(invalidIPv6s(message))
                    .concat(invalidIPvFutures(message)), done);
            });

            it('should validate all ipv4 and ipv6 addresses with an optional CIDR', (done) => {

                const schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4, ipv6] with a optional CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message))
                    .concat(validIPvFuturesWithoutCidr(false, message))
                    .concat(invalidIPs(message))
                    .concat(invalidIPv4s(message))
                    .concat(invalidIPv6s(message))
                    .concat(invalidIPvFutures(message)), done);
            });

            it('should validate all ipv4 and ipv6 addresses with a required CIDR', (done) => {

                const schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'required' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4, ipv6] with a required CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(false, message))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(false, message))
                    .concat(validIPvFuturesWithCidr(false, message))
                    .concat(validIPvFuturesWithoutCidr(false, message))
                    .concat(invalidIPs(message))
                    .concat(invalidIPv4s(message))
                    .concat(invalidIPv6s(message))
                    .concat(invalidIPvFutures(message)), done);
            });

            it('should validate all ipv4 and ipv6 addresses with a forbidden CIDR', (done) => {

                const schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' });
                const message = '"value" must be a valid ip address of one of the following versions [ipv4, ipv6] with a forbidden CIDR';
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false, message))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false, message))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false, message))
                    .concat(validIPvFuturesWithoutCidr(false, message))
                    .concat(invalidIPs(message))
                    .concat(invalidIPv4s(message))
                    .concat(invalidIPv6s(message))
                    .concat(invalidIPvFutures(message)), done);
            });
        });
    });

    describe('uri()', () => {

        it('validates uri', (done) => {

            // Handful of tests taken from Node: https://github.com/joyent/node/blob/cfcb1de130867197cbc9c6012b7e84e08e53d032/test/simple/test-url.js
            // Also includes examples from RFC 8936: http://tools.ietf.org/html/rfc3986#page-7
            const schema = Joi.string().uri();

            Helper.validate(schema, [
                ['foo://example.com:8042/over/there?name=ferret#nose', true],
                ['urn:example:animal:ferret:nose', true],
                ['ftp://ftp.is.co.za/rfc/rfc1808.txt', true],
                ['http://www.ietf.org/rfc/rfc2396.txt', true],
                ['ldap://[2001:db8::7]/c=GB?objectClass?one', true],
                ['ldap://2001:db8::7/c=GB?objectClass?one', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'ldap://2001:db8::7/c=GB?objectClass?one', label: 'value', key: undefined }
                    }]
                }],
                ['mailto:John.Doe@example.com', true],
                ['news:comp.infosystems.www.servers.unix', true],
                ['tel:+1-816-555-1212', true],
                ['telnet://192.0.2.16:80/', true],
                ['urn:oasis:names:specification:docbook:dtd:xml:4.1.2', true],
                ['file:///example.txt', true],
                ['http://asdf:qw%20er@localhost:8000?asdf=12345&asda=fc%2F#bacon', true],
                ['http://asdf@localhost:8000', true],
                ['http://[v1.09azAZ-._~!$&\'()*+,;=:]', true],
                ['http://[a:b:c:d:e::1.2.3.4]', true],
                ['coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]', true],
                ['http://[1080:0:0:0:8:800:200C:417A]', true],
                ['http://v1.09azAZ-._~!$&\'()*+,;=:', true], // This doesn't look valid, but it is. The `v1.09azAZ-._~!$&\'()*+,;=` part is a valid registered name as it has no invalid characters
                ['http://a:b:c:d:e::1.2.3.4', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://a:b:c:d:e::1.2.3.4', label: 'value', key: undefined }
                    }]
                }],
                ['coap://FEDC:BA98:7654:3210:FEDC:BA98:7654:3210', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'coap://FEDC:BA98:7654:3210:FEDC:BA98:7654:3210', label: 'value', key: undefined }
                    }]
                }],
                ['http://1080:0:0:0:8:800:200C:417A', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://1080:0:0:0:8:800:200C:417A', label: 'value', key: undefined }
                    }]
                }],
                ['http://127.0.0.1:8000/foo?bar', true],
                ['http://asdf:qwer@localhost:8000', true],
                ['http://user:pass%3A@localhost:80', true],
                ['http://localhost:123', true],
                ['https://localhost:123', true],
                ['file:///whatever', true],
                ['mailto:asdf@asdf.com', true],
                ['ftp://www.example.com', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['xmpp:isaacschlueter@jabber.org', true],
                ['f://some.host/path', true],
                ['http://localhost:18/asdf', true],
                ['http://localhost:42/asdf?qwer=zxcv', true],
                ['HTTP://www.example.com/', true],
                ['HTTP://www.example.com', true],
                ['http://www.ExAmPlE.com/', true],
                ['http://user:pw@www.ExAmPlE.com/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['http://user@www.example.com/', true],
                ['http://user%3Apw@www.example.com/', true],
                ['http://x.com/path?that%27s#all,%20folks', true],
                ['HTTP://X.COM/Y', true],
                ['http://www.narwhaljs.org/blog/categories?id=news', true],
                ['http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://_jabber._tcp.google.com:80/test', true],
                ['http://user:pass@_jabber._tcp.google.com:80/test', true],
                ['http://[fe80::1]/a/b?a=b#abc', true],
                ['http://fe80::1/a/b?a=b#abc', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://fe80::1/a/b?a=b#abc', label: 'value', key: undefined }
                    }]
                }],
                ['http://user:password@[3ffe:2a00:100:7031::1]:8080', true],
                ['coap://[1080:0:0:0:8:800:200C:417A]:61616/', true],
                ['coap://1080:0:0:0:8:800:200C:417A:61616/', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'coap://1080:0:0:0:8:800:200C:417A:61616/', label: 'value', key: undefined }
                    }]
                }],
                ['git+http://github.com/joyent/node.git', true],
                ['http://bucket_name.s3.amazonaws.com/image.jpg', true],
                ['dot.test://foo/bar', true],
                ['svn+ssh://foo/bar', true],
                ['dash-test://foo/bar', true],
                ['xmpp:isaacschlueter@jabber.org', true],
                ['http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['file://localhost/etc/node/', true],
                ['file:///etc/node/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['mailto:local1@domain1?query1', true],
                ['http://example/a/b?c/../d', true],
                ['http://example/x%2Fabc', true],
                ['http://a/b/c/d;p=1/g;x=1/y', true],
                ['http://a/b/c/g#s/../x', true],
                ['http://a/b/c/.foo', true],
                ['http://example.com/b//c//d;p?q#blarg', true],
                ['g:h', true],
                ['http://a/b/c/g', true],
                ['http://a/b/c/g/', true],
                ['http://a/g', true],
                ['http://g', true],
                ['http://a/b/c/d;p?y', true],
                ['http://a/b/c/g?y', true],
                ['http://a/b/c/d;p?q#s', true],
                ['http://a/b/c/g#s', true],
                ['http://a/b/c/g?y#s', true],
                ['http://a/b/c/;x', true],
                ['http://a/b/c/g;x', true],
                ['http://a/b/c/g;x?y#s', true],
                ['http://a/b/c/d;p?q', true],
                ['http://a/b/c/', true],
                ['http://a/b/', true],
                ['http://a/b/g', true],
                ['http://a/', true],
                ['http://a/g', true],
                ['http://a/g', true],
                ['file:/asda', true],
                ['qwerty', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'qwerty', label: 'value', key: undefined }
                    }]
                }],
                ['invalid uri', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'invalid uri', label: 'value', key: undefined }
                    }]
                }],
                ['1http://google.com', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '1http://google.com', label: 'value', key: undefined }
                    }]
                }],
                ['http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['(╯°□°)╯︵ ┻━┻', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '(╯°□°)╯︵ ┻━┻', label: 'value', key: undefined }
                    }]
                }],
                ['one/two/three?value=abc&value2=123#david-rules', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'one/two/three?value=abc&value2=123#david-rules', label: 'value', key: undefined }
                    }]
                }],
                ['//username:password@test.example.com/one/two/three?value=abc&value2=123#david-rules', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '//username:password@test.example.com/one/two/three?value=abc&value2=123#david-rules', label: 'value', key: undefined }
                    }]
                }],
                ['http://a\r" \t\n<\'b:b@c\r\nd/e?f', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://a\r" \t\n<\'b:b@c\r\nd/e?f', label: 'value', key: undefined }
                    }]
                }],
                ['/absolute', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '/absolute', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates uri with a single scheme provided', (done) => {

            const schema = Joi.string().uri({
                scheme: 'http'
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the http pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the http pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'http',
                            value: 'https://google.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ftp://google.com', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the http pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the http pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'http',
                            value: 'ftp://google.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:/asdf', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the http pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the http pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'http',
                            value: 'file:/asdf',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['/path?query=value#hash', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the http pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the http pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'http',
                            value: '/path?query=value#hash',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uri with a single regex scheme provided', (done) => {

            const schema = Joi.string().uri({
                scheme: /https?/
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', true],
                ['ftp://google.com', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the https? pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the https? pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'https?',
                            value: 'ftp://google.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:/asdf', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the https? pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the https? pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'https?',
                            value: 'file:/asdf',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['/path?query=value#hash', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the https? pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the https? pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'https?',
                            value: '/path?query=value#hash',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uri with multiple schemes provided', (done) => {

            const schema = Joi.string().uri({
                scheme: [/https?/, 'ftp', 'file', 'git+http']
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', true],
                ['ftp://google.com', true],
                ['file:/asdf', true],
                ['git+http://github.com/hapijs/joi', true],
                ['/path?query=value#hash', false, null, {
                    message: '"value" must be a valid uri with a scheme matching the https?|ftp|file|git\\+http pattern',
                    details: [{
                        message: '"value" must be a valid uri with a scheme matching the https?|ftp|file|git\\+http pattern',
                        path: [],
                        type: 'string.uriCustomScheme',
                        context: {
                            scheme: 'https?|ftp|file|git\\+http',
                            value: '/path?query=value#hash',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uri with a friendly error message', (done) => {

            const schema = { item: Joi.string().uri() };

            Joi.compile(schema).validate({ item: 'something invalid' }, (err, value) => {

                expect(err.message).to.contain('must be a valid uri');
                done();
            });
        });

        it('validates uri with a custom scheme with a friendly error message', (done) => {

            const schema = {
                item: Joi.string().uri({
                    scheme: 'http'
                })
            };

            Joi.compile(schema).validate({ item: 'something invalid' }, (err, value) => {

                expect(err.message).to.contain('must be a valid uri with a scheme matching the http pattern');
                done();
            });
        });

        it('validates uri with a custom array of schemes with a friendly error message', (done) => {

            const schema = {
                item: Joi.string().uri({
                    scheme: ['http', /https?/]
                })
            };

            Joi.compile(schema).validate({ item: 'something invalid' }, (err, value) => {

                expect(err.message).to.contain('must be a valid uri with a scheme matching the http|https? pattern');
                done();
            });
        });

        it('validates uri treats scheme as optional', (done) => {

            expect(() => {

                Joi.string().uri({});
            }).to.not.throw();

            done();
        });

        it('validates uri requires uriOptions as an object with a friendly error message', (done) => {

            expect(() => {

                Joi.string().uri('http');
            }).to.throw(Error, 'options must be an object');

            done();
        });

        it('validates uri requires scheme to be a RegExp, String, or Array with a friendly error message', (done) => {

            expect(() => {

                Joi.string().uri({
                    scheme: {}
                });
            }).to.throw(Error, 'scheme must be a RegExp, String, or Array');

            done();
        });

        it('validates uri requires scheme to not be an empty array', (done) => {

            expect(() => {

                Joi.string().uri({
                    scheme: []
                });
            }).to.throw(Error, 'scheme must have at least 1 scheme specified');

            done();
        });

        it('validates uri requires scheme to be an Array of schemes to all be valid schemes with a friendly error message', (done) => {

            expect(() => {

                Joi.string().uri({
                    scheme: [
                        'http',
                        '~!@#$%^&*()_'
                    ]
                });
            }).to.throw(Error, 'scheme at position 1 must be a valid scheme');

            done();
        });

        it('validates uri requires scheme to be an Array of schemes to be strings or RegExp', (done) => {

            expect(() => {

                Joi.string().uri({
                    scheme: [
                        'http',
                        {}
                    ]
                });
            }).to.throw(Error, 'scheme at position 1 must be a RegExp or String');

            done();
        });

        it('validates uri requires scheme to be a valid String scheme with a friendly error message', (done) => {

            expect(() => {

                Joi.string().uri({
                    scheme: '~!@#$%^&*()_'
                });
            }).to.throw(Error, 'scheme at position 0 must be a valid scheme');

            done();
        });

        it('validates relative uri', (done) => {

            const schema = Joi.string().uri({ allowRelative: true });
            Helper.validate(schema, [
                ['foo://example.com:8042/over/there?name=ferret#nose', true],
                ['urn:example:animal:ferret:nose', true],
                ['ftp://ftp.is.co.za/rfc/rfc1808.txt', true],
                ['http://www.ietf.org/rfc/rfc2396.txt', true],
                ['ldap://[2001:db8::7]/c=GB?objectClass?one', true],
                ['mailto:John.Doe@example.com', true],
                ['news:comp.infosystems.www.servers.unix', true],
                ['tel:+1-816-555-1212', true],
                ['telnet://192.0.2.16:80/', true],
                ['urn:oasis:names:specification:docbook:dtd:xml:4.1.2', true],
                ['file:///example.txt', true],
                ['http://asdf:qw%20er@localhost:8000?asdf=12345&asda=fc%2F#bacon', true],
                ['http://asdf@localhost:8000', true],
                ['http://[v1.09azAZ-._~!$&\'()*+,;=:]', true],
                ['http://[a:b:c:d:e::1.2.3.4]', true],
                ['coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]', true],
                ['http://[1080:0:0:0:8:800:200C:417A]', true],
                ['http://127.0.0.1:8000/foo?bar', true],
                ['http://asdf:qwer@localhost:8000', true],
                ['http://user:pass%3A@localhost:80', true],
                ['http://localhost:123', true],
                ['https://localhost:123', true],
                ['file:///whatever', true],
                ['mailto:asdf@asdf.com', true],
                ['ftp://www.example.com', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['xmpp:isaacschlueter@jabber.org', true],
                ['f://some.host/path', true],
                ['http://localhost:18/asdf', true],
                ['http://localhost:42/asdf?qwer=zxcv', true],
                ['HTTP://www.example.com/', true],
                ['HTTP://www.example.com', true],
                ['http://www.ExAmPlE.com/', true],
                ['http://user:pw@www.ExAmPlE.com/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['http://user@www.example.com/', true],
                ['http://user%3Apw@www.example.com/', true],
                ['http://x.com/path?that%27s#all,%20folks', true],
                ['HTTP://X.COM/Y', true],
                ['http://www.narwhaljs.org/blog/categories?id=news', true],
                ['http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://_jabber._tcp.google.com:80/test', true],
                ['http://user:pass@_jabber._tcp.google.com:80/test', true],
                ['http://[fe80::1]/a/b?a=b#abc', true],
                ['http://user:password@[3ffe:2a00:100:7031::1]:8080', true],
                ['coap://[1080:0:0:0:8:800:200C:417A]:61616/', true],
                ['git+http://github.com/joyent/node.git', true],
                ['http://bucket_name.s3.amazonaws.com/image.jpg', true],
                ['dot.test://foo/bar', true],
                ['svn+ssh://foo/bar', true],
                ['dash-test://foo/bar', true],
                ['xmpp:isaacschlueter@jabber.org', true],
                ['http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['file://localhost/etc/node/', true],
                ['file:///etc/node/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['mailto:local1@domain1?query1', true],
                ['http://example/a/b?c/../d', true],
                ['http://example/x%2Fabc', true],
                ['http://a/b/c/d;p=1/g;x=1/y', true],
                ['http://a/b/c/g#s/../x', true],
                ['http://a/b/c/.foo', true],
                ['http://example.com/b//c//d;p?q#blarg', true],
                ['g:h', true],
                ['http://a/b/c/g', true],
                ['http://a/b/c/g/', true],
                ['http://a/g', true],
                ['http://g', true],
                ['http://a/b/c/d;p?y', true],
                ['http://a/b/c/g?y', true],
                ['http://a/b/c/d;p?q#s', true],
                ['http://a/b/c/g#s', true],
                ['http://a/b/c/g?y#s', true],
                ['http://a/b/c/;x', true],
                ['http://a/b/c/g;x', true],
                ['http://a/b/c/g;x?y#s', true],
                ['http://a/b/c/d;p?q', true],
                ['http://a/b/c/', true],
                ['http://a/b/', true],
                ['http://a/b/g', true],
                ['http://a/', true],
                ['http://a/g', true],
                ['http://a/g', true],
                ['file:/asda', true],
                ['qwerty', true],
                ['invalid uri', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'invalid uri', label: 'value', key: undefined }
                    }]
                }],
                ['1http://google.com', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '1http://google.com', label: 'value', key: undefined }
                    }]
                }],
                ['http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['(╯°□°)╯︵ ┻━┻', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: '(╯°□°)╯︵ ┻━┻', label: 'value', key: undefined }
                    }]
                }],
                ['one/two/three?value=abc&value2=123#david-rules', true],
                ['//username:password@test.example.com/one/two/three?value=abc&value2=123#david-rules', true],
                ['http://a\r" \t\n<\'b:b@c\r\nd/e?f', false, null, {
                    message: '"value" must be a valid uri',
                    details: [{
                        message: '"value" must be a valid uri',
                        path: [],
                        type: 'string.uri',
                        context: { value: 'http://a\r" \t\n<\'b:b@c\r\nd/e?f', label: 'value', key: undefined }
                    }]
                }],
                ['/absolute', true]
            ], done);
        });

        it('validates relative only uri', (done) => {

            const schema = Joi.string().uri({ relativeOnly: true });
            Helper.validate(schema, [
                ['foo://example.com:8042/over/there?name=ferret#nose', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'foo://example.com:8042/over/there?name=ferret#nose',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['urn:example:animal:ferret:nose', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'urn:example:animal:ferret:nose',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ftp://ftp.is.co.za/rfc/rfc1808.txt', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'ftp://ftp.is.co.za/rfc/rfc1808.txt',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://www.ietf.org/rfc/rfc2396.txt', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://www.ietf.org/rfc/rfc2396.txt',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ldap://[2001:db8::7]/c=GB?objectClass?one', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'ldap://[2001:db8::7]/c=GB?objectClass?one',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['mailto:John.Doe@example.com', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'mailto:John.Doe@example.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['news:comp.infosystems.www.servers.unix', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'news:comp.infosystems.www.servers.unix',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['tel:+1-816-555-1212', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'tel:+1-816-555-1212',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['telnet://192.0.2.16:80/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'telnet://192.0.2.16:80/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['urn:oasis:names:specification:docbook:dtd:xml:4.1.2', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:///example.txt', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'file:///example.txt',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://asdf:qw%20er@localhost:8000?asdf=12345&asda=fc%2F#bacon', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://asdf:qw%20er@localhost:8000?asdf=12345&asda=fc%2F#bacon',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://asdf@localhost:8000', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://asdf@localhost:8000',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://[v1.09azAZ-._~!$&\'()*+,;=:]', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://[v1.09azAZ-._~!$&\'()*+,;=:]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://[a:b:c:d:e::1.2.3.4]', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://[a:b:c:d:e::1.2.3.4]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://[1080:0:0:0:8:800:200C:417A]', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://[1080:0:0:0:8:800:200C:417A]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://127.0.0.1:8000/foo?bar', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://127.0.0.1:8000/foo?bar',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://asdf:qwer@localhost:8000', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://asdf:qwer@localhost:8000',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user:pass%3A@localhost:80', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user:pass%3A@localhost:80',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://localhost:123', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://localhost:123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['https://localhost:123', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'https://localhost:123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:///whatever', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'file:///whatever',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['mailto:asdf@asdf.com', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'mailto:asdf@asdf.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ftp://www.example.com', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'ftp://www.example.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['javascript:alert(\'hello\');', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'javascript:alert(\'hello\');',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }], // eslint-disable-line no-script-url
                ['xmpp:isaacschlueter@jabber.org', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'xmpp:isaacschlueter@jabber.org',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['f://some.host/path', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'f://some.host/path',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://localhost:18/asdf', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://localhost:18/asdf',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://localhost:42/asdf?qwer=zxcv', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://localhost:42/asdf?qwer=zxcv',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['HTTP://www.example.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'HTTP://www.example.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['HTTP://www.example.com', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'HTTP://www.example.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://www.ExAmPlE.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://www.ExAmPlE.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user:pw@www.ExAmPlE.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user:pw@www.ExAmPlE.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://USER:PW@www.ExAmPlE.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://USER:PW@www.ExAmPlE.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user@www.example.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user@www.example.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user%3Apw@www.example.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user%3Apw@www.example.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://x.com/path?that%27s#all,%20folks', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://x.com/path?that%27s#all,%20folks',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['HTTP://X.COM/Y', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'HTTP://X.COM/Y',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://www.narwhaljs.org/blog/categories?id=news', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://www.narwhaljs.org/blog/categories?id=news',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://_jabber._tcp.google.com:80/test', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://_jabber._tcp.google.com:80/test',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user:pass@_jabber._tcp.google.com:80/test', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user:pass@_jabber._tcp.google.com:80/test',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://[fe80::1]/a/b?a=b#abc', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://[fe80::1]/a/b?a=b#abc',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://user:password@[3ffe:2a00:100:7031::1]:8080', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://user:password@[3ffe:2a00:100:7031::1]:8080',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['coap://[1080:0:0:0:8:800:200C:417A]:61616/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'coap://[1080:0:0:0:8:800:200C:417A]:61616/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['git+http://github.com/joyent/node.git', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'git+http://github.com/joyent/node.git',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://bucket_name.s3.amazonaws.com/image.jpg', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://bucket_name.s3.amazonaws.com/image.jpg',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['dot.test://foo/bar', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'dot.test://foo/bar',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['svn+ssh://foo/bar', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'svn+ssh://foo/bar',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['dash-test://foo/bar', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'dash-test://foo/bar',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['xmpp:isaacschlueter@jabber.org', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'xmpp:isaacschlueter@jabber.org',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['javascript:alert(\'hello\');', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'javascript:alert(\'hello\');',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }], // eslint-disable-line no-script-url
                ['file://localhost/etc/node/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'file://localhost/etc/node/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:///etc/node/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'file:///etc/node/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://USER:PW@www.ExAmPlE.com/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://USER:PW@www.ExAmPlE.com/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['mailto:local1@domain1?query1', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'mailto:local1@domain1?query1',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://example/a/b?c/../d', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://example/a/b?c/../d',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://example/x%2Fabc', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://example/x%2Fabc',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/d;p=1/g;x=1/y', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/d;p=1/g;x=1/y',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g#s/../x', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g#s/../x',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/.foo', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/.foo',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://example.com/b//c//d;p?q#blarg', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://example.com/b//c//d;p?q#blarg',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['g:h', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'g:h',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/d;p?y', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/d;p?y',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g?y', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g?y',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/d;p?q#s', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/d;p?q#s',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g#s', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g#s',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g?y#s', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g?y#s',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/;x', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/;x',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g;x', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g;x',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/g;x?y#s', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/g;x?y#s',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/d;p?q', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/d;p?q',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/c/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/c/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/b/g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/b/g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://a/g', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a/g',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['file:/asda', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'file:/asda',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['qwerty', true],
                ['invalid uri', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'invalid uri',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1http://google.com', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: '1http://google.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['(╯°□°)╯︵ ┻━┻', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: '(╯°□°)╯︵ ┻━┻',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['one/two/three?value=abc&value2=123#david-rules', true],
                ['//username:password@test.example.com/one/two/three?value=abc&value2=123#david-rules', true],
                ['http://a\r" \t\n<\'b:b@c\r\nd/e?f', false, null, {
                    message: '"value" must be a valid relative uri',
                    details: [{
                        message: '"value" must be a valid relative uri',
                        path: [],
                        type: 'string.uriRelativeOnly',
                        context: {
                            value: 'http://a\r" \t\n<\'b:b@c\r\nd/e?f',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['/absolute', true]
            ], done);
        });
    });

    describe('truncate()', () => {

        it('avoids unnecessary cloning when called twice', (done) => {

            const schema = Joi.string().truncate();
            expect(schema.truncate()).to.shallow.equal(schema);
            done();
        });

        it('switches the truncate flag', (done) => {

            const schema = Joi.string().truncate();
            const desc = schema.describe();
            expect(desc).to.equal({
                type: 'string',
                invalids: [''],
                flags: { truncate: true }
            });
            done();
        });

        it('switches the truncate flag with explicit value', (done) => {

            const schema = Joi.string().truncate(true);
            const desc = schema.describe();
            expect(desc).to.equal({
                type: 'string',
                invalids: [''],
                flags: { truncate: true }
            });
            done();
        });

        it('switches the truncate flag back', (done) => {

            const schema = Joi.string().truncate().truncate(false);
            const desc = schema.describe();
            expect(desc).to.equal({
                type: 'string',
                invalids: [''],
                flags: { truncate: false }
            });
            done();
        });

        it('does not change anything when used without max', (done) => {

            const schema = Joi.string().min(2).truncate();
            schema.validate('fooooooooooooooooooo', (err, value) => {

                expect(err).to.not.exist();
                expect(value).to.equal('fooooooooooooooooooo');
                done();
            });
        });

        it('truncates a string when used with max', (done) => {

            const schema = Joi.string().max(5).truncate();

            Helper.validate(schema, [
                ['abc', true, null, 'abc'],
                ['abcde', true, null, 'abcde'],
                ['abcdef', true, null, 'abcde']
            ], done);
        });

        it('truncates a string after transformations', (done) => {

            const schema = Joi.string().max(5).truncate().trim().replace(/a/g, 'aa');

            Helper.validate(schema, [
                ['abc', true, null, 'aabc'],
                ['abcde', true, null, 'aabcd'],
                ['abcdef', true, null, 'aabcd'],
                ['  abcdef  ', true, null, 'aabcd']
            ], done);
        });
    });

    describe('validate()', () => {

        it('should, by default, allow undefined, deny empty string', (done) => {

            Helper.validate(Joi.string(), [
                [undefined, true],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should, when .required(), deny undefined, deny empty string', (done) => {

            Helper.validate(Joi.string().required(), [
                [undefined, false, null, {
                    message: '"value" is required',
                    details: [{
                        message: '"value" is required',
                        path: [],
                        type: 'any.required',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should, when .required(), print a friend error message for an empty string', (done) => {

            const schema = Joi.string().required();
            Joi.compile(schema).validate('', (err, value) => {

                expect(err).to.be.an.error('"value" is not allowed to be empty');
                expect(err.details).to.equal([{
                    message: '"value" is not allowed to be empty',
                    path: [],
                    type: 'any.empty',
                    context: { label: 'value', key: undefined }
                }]);
                done();
            });
        });

        it('should, when .required(), print a friendly error message for trimmed whitespace', (done) => {

            const schema = Joi.string().trim().required();

            Joi.compile(schema).validate('    ', (err) => {

                expect(err).to.be.an.error('"value" is not allowed to be empty');
                expect(err.details).to.equal([{
                    message: '"value" is not allowed to be empty',
                    path: [],
                    type: 'any.empty',
                    context: { label: 'value', key: undefined }
                }]);
                done();
            });
        });

        it('should, when .required(), validate non-empty strings', (done) => {

            const schema = Joi.string().required();
            Helper.validate(schema, [
                ['test', true],
                ['0', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates invalid values', (done) => {

            const schema = Joi.string().invalid('a', 'b', 'c');
            Helper.validate(schema, [
                ['x', true],
                ['a', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['c', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should invert invalid values', (done) => {

            const schema = Joi.string().valid('a', 'b', 'c');
            Helper.validate(schema, [
                ['x', false, null, {
                    message: '"value" must be one of [a, b, c]',
                    details: [{
                        message: '"value" must be one of [a, b, c]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['a', 'b', 'c'], label: 'value', key: undefined }
                    }]
                }],
                ['a', true],
                ['c', true]
            ], done);
        });

        it('validates array arguments correctly', (done) => {

            const schema = Joi.string().valid(['a', 'b', 'c']);
            Helper.validate(schema, [
                ['x', false, null, {
                    message: '"value" must be one of [a, b, c]',
                    details: [{
                        message: '"value" must be one of [a, b, c]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['a', 'b', 'c'], label: 'value', key: undefined }
                    }]
                }],
                ['a', true],
                ['c', true]
            ], done);
        });

        it('validates minimum length when min is used', (done) => {

            const schema = Joi.string().min(3);
            Helper.validate(schema, [
                ['test', true],
                ['0', false, null, {
                    message: '"value" length must be at least 3 characters long',
                    details: [{
                        message: '"value" length must be at least 3 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 3,
                            value: '0',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates minimum length when min is 0', (done) => {

            const schema = Joi.string().min(0).required();
            Helper.validate(schema, [
                ['0', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }],
                [undefined, false, null, {
                    message: '"value" is required',
                    details: [{
                        message: '"value" is required',
                        path: [],
                        type: 'any.required',
                        context: { label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return false with minimum length and a null value passed in', (done) => {

            const schema = Joi.string().min(3);
            Helper.validate(schema, [
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('null allowed overrides min length requirement', (done) => {

            const schema = Joi.string().min(3).allow(null);
            Helper.validate(schema, [
                [null, true]
            ], done);
        });

        it('validates maximum length when max is used', (done) => {

            const schema = Joi.string().max(3);
            Helper.validate(schema, [
                ['test', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'test',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['0', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return true with max and not required when value is undefined', (done) => {

            const schema = Joi.string().max(3);
            Helper.validate(schema, [
                [undefined, true]
            ], done);
        });

        it('validates length requirements', (done) => {

            const schema = Joi.string().length(3);
            Helper.validate(schema, [
                ['test', false, null, {
                    message: '"value" length must be 3 characters long',
                    details: [{
                        message: '"value" length must be 3 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 3,
                            value: 'test',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['0', false, null, {
                    message: '"value" length must be 3 characters long',
                    details: [{
                        message: '"value" length must be 3 characters long',
                        path: [],
                        type: 'string.length',
                        context: {
                            limit: 3,
                            value: '0',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }],
                ['abc', true]
            ], done);
        });

        it('validates regex', (done) => {

            const schema = Joi.string().regex(/^[0-9][-][a-z]+$/);
            Helper.validate(schema, [
                ['van', false, null, {
                    message: '"value" with value "van" fails to match the required pattern: /^[0-9][-][a-z]+$/',
                    details: [{
                        message: '"value" with value "van" fails to match the required pattern: /^[0-9][-][a-z]+$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^[0-9][-][a-z]+$/,
                            value: 'van',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['0-www', true]
            ], done);
        });

        it('validates regex (ignoring global flag)', (done) => {

            const schema = Joi.string().regex(/a/g);
            Helper.validate(schema, [
                ['ab', true],
                ['ac', true]
            ], done);
        });

        it('validates token', (done) => {

            const schema = Joi.string().token();
            Helper.validate(schema, [
                ['w0rld_of_w4lm4rtl4bs', true],
                ['w0rld of_w4lm4rtl4bs', false, null, {
                    message: '"value" must only contain alpha-numeric and underscore characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric and underscore characters',
                        path: [],
                        type: 'string.token',
                        context: { value: 'w0rld of_w4lm4rtl4bs', label: 'value', key: undefined }
                    }]
                }],
                ['abcd#f?h1j orly?', false, null, {
                    message: '"value" must only contain alpha-numeric and underscore characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric and underscore characters',
                        path: [],
                        type: 'string.token',
                        context: { value: 'abcd#f?h1j orly?', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates alphanum', (done) => {

            const schema = Joi.string().alphanum();
            Helper.validate(schema, [
                ['w0rld of w4lm4rtl4bs', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: 'w0rld of w4lm4rtl4bs', label: 'value', key: undefined }
                    }]
                }],
                ['w0rldofw4lm4rtl4bs', true],
                ['abcd#f?h1j orly?', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: 'abcd#f?h1j orly?', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('should return false for denied value', (done) => {

            const text = Joi.string().invalid('joi');
            text.validate('joi', (err, value) => {

                expect(err).to.exist();
                done();
            });
        });

        it('should return true for allowed value', (done) => {

            const text = Joi.string().allow('hapi');
            text.validate('result', (err, value) => {

                expect(err).to.not.exist();
                done();
            });
        });

        it('validates with one validator (min)', (done) => {

            const text = Joi.string().min(3);
            text.validate('joi', (err, value) => {

                expect(err).to.not.exist();
                done();
            });
        });

        it('validates with two validators (min, required)', (done) => {

            const text = Joi.string().min(3).required();
            text.validate('joi', (err, value) => {

                expect(err).to.not.exist();

                text.validate('', (err2, value2) => {

                    expect(err2).to.exist();
                    done();
                });
            });
        });

        it('validates null with allow(null)', (done) => {

            Helper.validate(Joi.string().allow(null), [
                [null, true]
            ], done);
        });

        it('validates "" (empty string) with allow(\'\')', (done) => {

            Helper.validate(Joi.string().allow(''), [
                ['', true],
                ['', true]
            ], done);
        });

        it('validates combination of required and min', (done) => {

            const rule = Joi.string().required().min(3);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 3 characters long',
                    details: [{
                        message: '"value" length must be at least 3 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 3,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of required and max', (done) => {

            const rule = Joi.string().required().max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of allow(\'\') and min', (done) => {

            const rule = Joi.string().allow('').min(3);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 3 characters long',
                    details: [{
                        message: '"value" length must be at least 3 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 3,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', true],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of allow(\'\') and max', (done) => {

            const rule = Joi.string().allow('').max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of null allowed and max', (done) => {

            const rule = Joi.string().allow(null).max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, true]
            ], done);
        });

        it('validates combination of min and max', (done) => {

            const rule = Joi.string().min(2).max(3);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, and allow(\'\')', (done) => {

            const rule = Joi.string().min(2).max(3).allow('');
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, and required', (done) => {

            const rule = Joi.string().min(2).max(3).required();
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, and regex', (done) => {

            const rule = Joi.string().min(2).max(3).regex(/^a/);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, regex, and allow(\'\')', (done) => {

            const rule = Joi.string().min(2).max(3).regex(/^a/).allow('');
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, regex, and required', (done) => {

            const rule = Joi.string().min(2).max(3).regex(/^a/).required();
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, and alphanum', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum();
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, alphanum, and allow(\'\')', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum().allow('');
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, alphanum, and required', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum().required();
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', true],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, alphanum, and regex', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum().regex(/^a/);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, alphanum, required, and regex', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum().required().regex(/^a/);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of min, max, alphanum, allow(\'\'), and regex', (done) => {

            const rule = Joi.string().min(2).max(3).alphanum().allow('').regex(/^a/);
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" length must be at least 2 characters long',
                    details: [{
                        message: '"value" length must be at least 2 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 2,
                            value: 'x',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" with value "123" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "123" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '123',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: '1234',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" with value "12" fails to match the required pattern: /^a/',
                    details: [{
                        message: '"value" with value "12" fails to match the required pattern: /^a/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^a/,
                            value: '12',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false, null, {
                    message: '"value" length must be less than or equal to 3 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 3 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 3,
                            value: 'abcd',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must only contain alpha-numeric characters',
                    details: [{
                        message: '"value" must only contain alpha-numeric characters',
                        path: [],
                        type: 'string.alphanum',
                        context: { value: '*ab', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email and min', (done) => {

            const rule = Joi.string().email().min(8);
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', true],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, and max', (done) => {

            const rule = Joi.string().email().min(8).max(10);
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, and invalid', (done) => {

            const rule = Joi.string().email().min(8).max(10).invalid('123@x.com');
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, and allow', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, allow, and invalid', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, and allow(\'\')', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, allow, and allow(\'\')', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com').allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, and regex', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').regex(/^1/);
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, regex, and allow(\'\')', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').regex(/^1/).allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, and allow(\'\')', (done) => {

            const rule = Joi.string().email().min(8).max(10).allow('');
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, and regex', (done) => {

            const rule = Joi.string().email().min(8).max(10).regex(/^1234/);
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', false, null, {
                    message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                    details: [{
                        message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^1234/,
                            value: '123@x.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, regex, and allow(\'\')', (done) => {

            const rule = Joi.string().email().min(8).max(10).regex(/^1234/).allow('');
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', false, null, {
                    message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                    details: [{
                        message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^1234/,
                            value: '123@x.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of email, min, max, regex, and required', (done) => {

            const rule = Joi.string().email().min(8).max(10).regex(/^1234/).required();
            Helper.validate(rule, [
                ['x@x.com', false, null, {
                    message: '"value" length must be at least 8 characters long',
                    details: [{
                        message: '"value" length must be at least 8 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 8,
                            value: 'x@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['123@x.com', false, null, {
                    message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                    details: [{
                        message: '"value" with value "123&#x40;x.com" fails to match the required pattern: /^1234/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^1234/,
                            value: '123@x.com',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1234@x.com', true],
                ['12345@x.com', false, null, {
                    message: '"value" length must be less than or equal to 10 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 10 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 10,
                            value: '12345@x.com',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates isoDate', (done) => {

            Helper.validateOptions(Joi.string().isoDate(), [
                ['+002013-06-07T14:21:46.295Z', true],
                ['-002013-06-07T14:21:46.295Z', true],
                ['002013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '002013-06-07T14:21:46.295Z', label: 'value', key: undefined }
                    }]
                }],
                ['+2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '+2013-06-07T14:21:46.295Z', label: 'value', key: undefined }
                    }]
                }],
                ['-2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '-2013-06-07T14:21:46.295Z', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z', true],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', true],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', true],
                ['2013-06-07T14:21:46+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', true],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', true],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', true],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14.2334,4', true],
                ['2013-06-07T14,23:34', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14,23:34', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T24', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T24', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T24:00', true],
                ['2013-06-07T24:21', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T24:21', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07 142146.295', true],
                ['2013-06-07 146946.295', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07 146946.295', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07 1421,44', true],
                ['2013-W23', true],
                ['2013-W23-1', true],
                ['2013-W2311', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-W2311', label: 'value', key: undefined }
                    }]
                }],
                ['2013-W231', true],
                ['2013-M231', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-M231', label: 'value', key: undefined }
                    }]
                }],
                ['2013-W23-1T14:21', true],
                ['2013-W23-1T14:21:', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-W23-1T14:21:', label: 'value', key: undefined }
                    }]
                }],
                ['2013-W23-1T14:21:46+07:00', true],
                ['2013-W23-1T14:21:46+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-W23-1T14:21:46+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-W23-1T14:21:46-07:00', true],
                ['2013-184', true],
                ['2013-1841', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-1841', label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates isoDate with a friendly error message', (done) => {

            const schema = { item: Joi.string().isoDate() };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err.message).to.contain('must be a valid ISO 8601 date');
                done();
            });
        });

        it('validates combination of isoDate and min', (done) => {

            const rule = Joi.string().isoDate().min(23);
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', true],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', true],
                ['2013-06-07T14:21:46Z', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', true],
                ['2013-06-07T14:21:46-07:00', true],
                ['2013-06-07T14:21Z', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 23 characters long',
                    details: [{
                        message: '"value" length must be at least 23 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min and max', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23);
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max and invalid', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).invalid('2013-06-07T14:21+07:00');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max and allow', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, allow and invalid', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21+07:00');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and allow(\'\')', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21+07:00').allow('');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and allow(\'\')', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').allow('');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and regex', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21Z').regex(/Z$/);
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21+07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21-07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, allow, invalid, regex and allow(\'\')', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21Z').regex(/Z$/).allow('');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21+07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21-07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max and allow(\'\')', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).allow('');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max and regex', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/);
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21+07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21-07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, regex and allow(\'\')', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/).allow('');
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21+07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21-07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates combination of isoDate, min, max, regex and required', (done) => {

            const rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/).required();
            Helper.validateOptions(rule, [
                ['2013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295Z',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46.295+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46.295+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46.295-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46.295-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21:46Z0', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21:46+07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46+07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21:46-07:00', false, null, {
                    message: '"value" length must be less than or equal to 23 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 23 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 23,
                            value: '2013-06-07T14:21:46-07:00',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21&#x2b;07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21+07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21+07:000', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21+07:000', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21-07:00', false, null, {
                    message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                    details: [{
                        message: '"value" with value "2013-06-07T14:21-07:00" fails to match the required pattern: /Z$/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /Z$/,
                            value: '2013-06-07T14:21-07:00',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T14:21Z+7:00', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T14:21Z+7:00', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['2013-06-07T', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-06-07T', label: 'value', key: undefined }
                    }]
                }],
                ['2013-06-07T14:21', false, null, {
                    message: '"value" length must be at least 17 characters long',
                    details: [{
                        message: '"value" length must be at least 17 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 17,
                            value: '2013-06-07T14:21',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['1-1-2013', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '1-1-2013', label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], { convert: false }, done);
        });

        it('validates and formats isoDate with convert set to true (default)', (done) => {

            const rule = Joi.string().isoDate();
            Helper.validateOptions(rule, [
                ['+002013-06-07T14:21:46.295Z', true, null, '2013-06-07T14:21:46.295Z'],
                ['-002013-06-07T14:21:46.295Z', true, null, '-002013-06-07T14:21:46.295Z'],
                ['2013-06-07T14:21:46.295Z', true, null, '2013-06-07T14:21:46.295Z'],
                ['2013-06-07T14:21:46.295+07:00', true, null, '2013-06-07T07:21:46.295Z'],
                ['2013-06-07T14:21:46.295-07:00', true, null, '2013-06-07T21:21:46.295Z'],
                ['2013-06-07T14:21:46Z', true, null, '2013-06-07T14:21:46.000Z'],
                ['2013-06-07T14:21:46+07:00', true, null, '2013-06-07T07:21:46.000Z'],
                ['2013-06-07T14:21:46-07:00', true, null, '2013-06-07T21:21:46.000Z'],
                ['2013-06-07T14:21Z', true, null, '2013-06-07T14:21:00.000Z'],
                ['2013-06-07T14:21+07:00', true, null, '2013-06-07T07:21:00.000Z'],
                ['2013-06-07T14:21-07:00', true, null, '2013-06-07T21:21:00.000Z'],
                ['2013-06-07', true, null, '2013-06-07T00:00:00.000Z'],
                ['2013-06-07T14:21', true, null, '2013-06-07T14:21:00.000Z'],
                ['2013-184', false, null, {
                    message: '"value" must be a valid ISO 8601 date',
                    details: [{
                        message: '"value" must be a valid ISO 8601 date',
                        path: [],
                        type: 'string.isoDate',
                        context: { value: '2013-184', label: 'value', key: undefined }
                    }]
                }]
            ], { convert: true }, done);
        });

        it('validates an hexadecimal string', (done) => {

            const rule = Joi.string().hex();
            Helper.validate(rule, [
                ['123456789abcdef', true],
                ['123456789AbCdEf', true],
                ['123afg', false, null, {
                    message: '"value" must only contain hexadecimal characters',
                    details: [{
                        message: '"value" must only contain hexadecimal characters',
                        path: [],
                        type: 'string.hex',
                        context: { value: '123afg', label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates the base64 options', (done) => {

            expect(() => {

                Joi.string().base64('a');
            }).to.throw('base64 options must be an object');

            expect(() => {

                Joi.string().base64({ paddingRequired: 'a' });
            }).to.throw('paddingRequired must be boolean');
            done();
        });

        it('validates a base64 string with no options', (done) => {

            const rule = Joi.string().base64();
            Helper.validate(rule, [
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4=', true],
                ['=YW55IGNhcm5hbCBwbGVhc3VyZS4', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '=YW55IGNhcm5hbCBwbGVhc3VyZS4',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4==', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4==',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y=', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y===', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y===',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW==', true],
                ['YW5', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW5',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW5=', true],
                ['$#%#$^$^)(*&^%', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '$#%#$^$^)(*&^%',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates a base64 string with padding explicitly required', (done) => {

            const rule = Joi.string().base64({ paddingRequired: true });
            Helper.validate(rule, [
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4=', true],
                ['=YW55IGNhcm5hbCBwbGVhc3VyZS4', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '=YW55IGNhcm5hbCBwbGVhc3VyZS4',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4==', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4==',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y=', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y===', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y===',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW==', true],
                ['YW5', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW5',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW5=', true],
                ['$#%#$^$^)(*&^%', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '$#%#$^$^)(*&^%',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates a base64 string with padding not required', (done) => {

            const rule = Joi.string().base64({ paddingRequired: false });
            Helper.validate(rule, [
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4=', true],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4==', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4==',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4', true],
                ['=YW55IGNhcm5hbCBwbGVhc3VyZS4', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '=YW55IGNhcm5hbCBwbGVhc3VyZS4',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IGNhcm5hbCBwbGVhc3VyZS4==', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IGNhcm5hbCBwbGVhc3VyZS4==',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW55IG==cm5hbCBwbGVhc3VyZS4=', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'YW55IG==cm5hbCBwbGVhc3VyZS4=',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y$', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y$',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['Y===', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: 'Y===',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['YW', true],
                ['YW==', true],
                ['YW5', true],
                ['YW5=', true],
                ['$#%#$^$^)(*&^%', false, null, {
                    message: '"value" must be a valid base64 string',
                    details: [{
                        message: '"value" must be a valid base64 string',
                        path: [],
                        type: 'string.base64',
                        context: {
                            value: '$#%#$^$^)(*&^%',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates combination of uppercase, min, max, alphanum and valid', (done) => {

            const rule = Joi.string().uppercase().min(2).max(3).alphanum().valid('AB', 'BC');
            Helper.validate(rule, [
                ['x', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['123', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['1234', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['12', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['ab', true],
                ['abc', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['a2c', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['abcd', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['*ab', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['bc', true],
                ['BC', true],
                ['de', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['ABc', false, null, {
                    message: '"value" must be one of [AB, BC]',
                    details: [{
                        message: '"value" must be one of [AB, BC]',
                        path: [],
                        type: 'any.allowOnly',
                        context: { valids: ['AB', 'BC'], label: 'value', key: undefined }
                    }]
                }],
                ['AB', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('guid()', () => {

        it('throws when options.version is not a string', (done) => {

            expect(() => {

                Joi.string().guid({ version: 42 });
            }).to.throw('version at position 0 must be a string');
            done();
        });

        it('throws when options.version is not a valid value', (done) => {

            expect(() => {

                Joi.string().guid({ version: '42' });
            }).to.throw('version at position 0 must be one of uuidv1, uuidv2, uuidv3, uuidv4, uuidv5');
            done();
        });

        it('validates guid', (done) => {

            Helper.validate(Joi.string().guid(), [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', true],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', true],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-0CD4-005E-EFDD53D08E8D}', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uuidv1', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv1'] }), [
                ['{D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F1DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-1548-85E4-04FC71357423', true],
                ['677E2553DD4D13B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-1717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d1cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-1c48-9b33-68921dd72463', true],
                ['b4b2fb69c6241e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-1CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-1CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-1E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-1E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-1CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-1CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-1CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:1CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:1CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-1CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-1CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-1CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-1CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uuidv2', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv2'] }), [
                ['{D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F2DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-2548-85E4-04FC71357423', true],
                ['677E2553DD4D23B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-2717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d2cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-2c48-9b33-68921dd72463', true],
                ['b4b2fb69c6242e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-2CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-2CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-2E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-2E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-2CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-2CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-2CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:2CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:2CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-2CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-2CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-2CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-2CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uuidv3', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv3'] }), [
                ['{D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F3DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-3548-85E4-04FC71357423', true],
                ['677E2553DD4D33B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-3717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d3cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-3c48-9b33-68921dd72463', true],
                ['b4b2fb69c6243e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-3CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-3CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-3E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-3E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-3CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-3CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-3CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:3CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:3CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-3CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-3CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-3CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-3CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uuidv4', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv4'] }), [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', true],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', true],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates uuidv5', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv5'] }), [
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F5DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-5548-85E4-04FC71357423', true],
                ['677E2553DD4D53B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-5717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d5cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-5c48-9b33-68921dd72463', true],
                ['b4b2fb69c6245e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-5E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-5E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates multiple uuid versions (1,3,5)', (done) => {

            Helper.validate(Joi.string().guid({ version: ['uuidv1', 'uuidv3', 'uuidv5'] }), [
                ['{D1A5279D-B27D-1CD4-805E-EFDD53D08E8D}', true],
                ['{D1A5279D-B27D-3CD4-905E-EFDD53D08E8D}', true],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F5DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-5548-85E4-04FC71357423', true],
                ['677E2553DD4D53B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-5717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d5cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-5c48-9b33-68921dd72463', true],
                ['b4b2fb69c6245e5eb0698e0c6ec66618', true],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-C05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-C05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-5E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-5E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D]', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D]',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D:B27D-5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D:B27D-5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D:5CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D:5CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4:A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4:A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-5CD4-A05E:EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-5CD4-A05E:EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }]
            ], done);
        });

        it('validates guid with a friendly error message', (done) => {

            const schema = { item: Joi.string().guid() };
            Joi.compile(schema).validate({ item: 'something' }, (err, value) => {

                expect(err).to.be.an.error('child "item" fails because ["item" must be a valid GUID]');
                expect(err.details).to.equal([{
                    message: '"item" must be a valid GUID',
                    path: ['item'],
                    type: 'string.guid',
                    context: { value: 'something', label: 'item', key: 'item' }
                }]);
                done();
            });
        });

        it('validates combination of guid and min', (done) => {

            const rule = Joi.string().guid().min(36);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" length must be at least 36 characters long',
                    details: [{
                        message: '"value" length must be at least 36 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 36,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', true],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" length must be at least 36 characters long',
                    details: [{
                        message: '"value" length must be at least 36 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 36,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', false, null, {
                    message: '"value" length must be at least 36 characters long',
                    details: [{
                        message: '"value" length must be at least 36 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 36,
                            value: '{7e9081b59a6d4cc1a8c347f69fb4198d}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', true],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" length must be at least 36 characters long',
                    details: [{
                        message: '"value" length must be at least 36 characters long',
                        path: [],
                        type: 'string.min',
                        context: {
                            limit: 36,
                            value: 'b4b2fb69c6244e5eb0698e0c6ec66618',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min and max', (done) => {

            const rule = Joi.string().guid().min(32).max(34);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max and invalid', (done) => {

            const rule = Joi.string().guid().min(32).max(34).invalid('b4b2fb69c6244e5eb0698e0c6ec66618');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max and allow', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, allow and invalid', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').invalid('b4b2fb69c6244e5eb0698e0c6ec66618');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid and allow(\'\')', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, allow and allow(\'\')', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid and regex', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').regex(/^{7e908/);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e908/',
                    details: [{
                        message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e908/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e908/,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e908/',
                    details: [{
                        message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e908/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e908/,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid, regex and allow(\'\')', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').regex(/^{7e908/).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e908/',
                    details: [{
                        message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e908/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e908/,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e908/',
                    details: [{
                        message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e908/',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e908/,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" contains an invalid value',
                    details: [{
                        message: '"value" contains an invalid value',
                        path: [],
                        type: 'any.invalid',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max and allow(\'\')', (done) => {

            const rule = Joi.string().guid().min(32).max(34).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max and regex', (done) => {

            const rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: 'b4b2fb69c6244e5eb0698e0c6ec66618',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, regex and allow(\'\')', (done) => {

            const rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: 'b4b2fb69c6244e5eb0698e0c6ec66618',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', true],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });

        it('validates combination of guid, min, max, regex and required', (done) => {

            const rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i).required();
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false, null, {
                    message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "&#x7b;B59511BD6A5F4DF09ECF562A108D8A2E&#x7d;" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '{B59511BD6A5F4DF09ECF562A108D8A2E}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['69593D62-71EA-4548-85E4-04FC71357423', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '69593D62-71EA-4548-85E4-04FC71357423',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false, null, {
                    message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "677E2553DD4D43B09DA77414DB1EB8EA" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: '677E2553DD4D43B09DA77414DB1EB8EA',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false, null, {
                    message: '"value" length must be less than or equal to 34 characters long',
                    details: [{
                        message: '"value" length must be less than or equal to 34 characters long',
                        path: [],
                        type: 'string.max',
                        context: {
                            limit: 34,
                            value: '0c74f13f-fa83-4c48-9b33-68921dd72463',
                            encoding: undefined,
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false, null, {
                    message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                    details: [{
                        message: '"value" with value "b4b2fb69c6244e5eb0698e0c6ec66618" fails to match the required pattern: /^{7e9081/i',
                        path: [],
                        type: 'string.regex.base',
                        context: {
                            name: undefined,
                            pattern: /^{7e9081/i,
                            value: 'b4b2fb69c6244e5eb0698e0c6ec66618',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{283B67B2-430F-4E6F-97E6-19041992-C1B0}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: '{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false, null, {
                    message: '"value" must be a valid GUID',
                    details: [{
                        message: '"value" must be a valid GUID',
                        path: [],
                        type: 'string.guid',
                        context: {
                            value: 'D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}',
                            label: 'value',
                            key: undefined
                        }
                    }]
                }],
                ['', false, null, {
                    message: '"value" is not allowed to be empty',
                    details: [{
                        message: '"value" is not allowed to be empty',
                        path: [],
                        type: 'any.empty',
                        context: { label: 'value', key: undefined }
                    }]
                }],
                [null, false, null, {
                    message: '"value" must be a string',
                    details: [{
                        message: '"value" must be a string',
                        path: [],
                        type: 'string.base',
                        context: { value: null, label: 'value', key: undefined }
                    }]
                }]
            ], done);
        });
    });

    describe('describe()', () => {

        it('describes various versions of a guid', (done) => {

            const schema = Joi.string().guid({ version: ['uuidv1', 'uuidv3', 'uuidv5'] });
            const description = schema.describe();
            expect(description).to.equal({
                invalids: [
                    ''
                ],
                rules: [
                    {
                        arg: {
                            version: [
                                'uuidv1',
                                'uuidv3',
                                'uuidv5'
                            ]
                        },
                        name: 'guid'
                    }
                ],
                type: 'string'
            });
            done();
        });

        it('describes invert regex pattern', (done) => {

            const schema = Joi.string().regex(/[a-z]/, {
                invert: true
            });
            const description = schema.describe();
            expect(description).to.equal({
                type: 'string',
                invalids: [''],
                rules: [
                    {
                        name: 'regex',
                        arg: {
                            pattern: /[a-z]/,
                            invert: true
                        }
                    }
                ]
            });
            done();
        });
    });
});
