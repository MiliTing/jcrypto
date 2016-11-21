'use strict';

var fs = require('fs');

var getHmac = require('../../src/hmac-generator.js'),
    getAes = require('../../src/aes-generator.js');

var generateHmac = function(k, options) {
    var code = getHmac(k, options);
    fs.writeFileSync(options.file, code);
};

var generateAes = function(k, options) {
    var code = getAes(k, options);
    fs.writeFileSync(options.file, code);
};

module.exports = {generateAes: generateAes, generateHmac: generateHmac};

