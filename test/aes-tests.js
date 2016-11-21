'use strict';

var path = require('path'),
    api = require('./utils/api'),
    tests = require('./spec/aes.spec');

var testOptions = [
    {wrapper: 'UMD'},
    {wrapper: 'IIFE'},
    {wrapper: 'UMD', mangle: {properties: true}},
    {wrapper: 'IIFE', mangle: {names: true, properties: true}}
];

var options = {encoding: 'hex'};

var testAggregator = function(test, params) {
    var aes;
   
    for(var i = 0; i < testOptions.length; i++) {
        options.file = path.join(__dirname, '../tmp/test-' + i + '-' + params.fileName);
        options.wrapper = testOptions[i].wrapper;
        api.generateAes(params.key, options);
        aes = require(path.join(options.file));
        test.strictEqual(aes.encrypt(params.plainText, {counter: params.counter, encoding: 'hex'}).substring(32), params.encryptText);
    }
    test.done();
};

tests.forEach(function(item) {
    exports[item.name] = function(test) {
        testAggregator(test, item.params);
    };
});
