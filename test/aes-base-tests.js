'use strict';

var tests = require('./spec/aes_base.spec'),
    api = require('./utils/api');

var basicEncryptionTest = function(aes, text) {
    return aes.decrypt(aes.encrypt(text));
};

var key = '2b7e151628aed2a6abf7158809cf4f3c';
api.generateAes(key, {encoding: 'hex', wrapper: 'UMD', file: 'tmp/wbaes-smoke-umd.js'});
api.generateAes(key, {encoding: 'hex', wrapper: 'IIFE', file: 'tmp/wbaes-smoke-iife.js'});
api.generateAes(key, {encoding: 'hex', wrapper: 'UMD', mangle: {properties: true}, file: 'tmp/wbaes-smoke-props.js'});
api.generateAes(key, {encoding: 'hex', wrapper: 'IIFE', mangle: {names: true, properties: true}, file: 'tmp/wbaes-smoke-names.js'});

var bAesUMD = require('../tmp/wbaes-smoke-umd.js'),
    bAesIIFE = require('../tmp/wbaes-smoke-iife.js'),
    bAesMangleProps = require('../tmp/wbaes-smoke-props.js'),
    bAesMangleNames = require('../tmp/wbaes-smoke-names.js');

var testAggregator = function(test, params) {
    test.expect(4);
    test.strictEqual(basicEncryptionTest(bAesUMD, params.plainText), params.plainText);
    test.strictEqual(basicEncryptionTest(bAesIIFE, params.plainText), params.plainText);
    test.strictEqual(basicEncryptionTest(bAesMangleProps, params.plainText), params.plainText);
    test.strictEqual(basicEncryptionTest(bAesMangleNames, params.plainText), params.plainText);
    test.done();
};

tests.forEach(function(item) {
    exports[item.name] = function(test) {
        testAggregator(test, item.params);
    };
});

