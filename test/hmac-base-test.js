var api = require('./utils/api'),
    tests = require('./spec/hmac_base.spec');

var key = '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F60616263';

api.generateHmac(key, {encoding: 'hex', wrapper: 'UMD', file: 'tmp/hmac-jssha-umd.js'});
api.generateHmac(key, {encoding: 'hex', wrapper: 'IIFE', file: 'tmp/hmac-jssha-iife.js'});
api.generateHmac(key, {encoding: 'hex', wrapper: 'UMD', mangle: {properties: true}, file: 'tmp/hmac-jssha-props.js'});
api.generateHmac(key, {encoding: 'hex', wrapper: 'IIFE', mangle: {names: true, properties: true}, file: 'tmp/hmac-jssha-names.js'});

var hashUMD = require('../tmp/hmac-jssha-umd.js'),
    hashIIFE = require('../tmp/hmac-jssha-iife.js'),
    hashMangleProps = require('../tmp/hmac-jssha-props.js'),
    hashMangleNames = require('../tmp/hmac-jssha-names.js');

var testAggregator = function(test, params) {
    test.expect(4);
    test.strictEqual(hashUMD(params.data, {encoding: 'hex'}), params.hash);
    test.strictEqual(hashIIFE(params.data, {encoding: 'hex'}), params.hash);
    test.strictEqual(hashMangleProps(params.data, {encoding: 'hex'}), params.hash);
    test.strictEqual(hashMangleNames(params.data, {encoding: 'hex'}), params.hash);
    test.done();
};

tests.forEach(function(item) {
    exports[item.name] = function(test) {
        testAggregator(test, item.params);
    };
});


