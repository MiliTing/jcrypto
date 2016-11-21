'use strict';

var path = require('path'),
    api = require('./utils/api'),
    tests = require('./spec/hmac.spec');

var testOptions = [
    {wrapper: 'UMD'},
    {wrapper: 'IIFE'},
    {wrapper: 'UMD', mangle: {properties: true}},
    {wrapper: 'IIFE', mangle: {names: true, properties: true}}
];

var options = {};

var testAggregator = function(test, params) {
    var hmac;
    
    for(var i = 0; i < testOptions.length; i++) {
        options.file = path.join(__dirname, '../tmp/test-' + i + '-' + params.fileName);
        options.wrapper = testOptions[i].wrapper;
        options.encoding = params.keyEncoding;
        api.generateHmac(params.key, options);
        hmac = require(path.join(options.file));

        test.strictEqual(hmac(params.data, {encoding: params.dataEncoding}), params.hash);
    }
    test.done();
};

tests.forEach(function(item) {
    exports[item.name] = function(test) {
        testAggregator(test, item.params);
    };
});
