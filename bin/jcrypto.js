#!/usr/bin/env node

var fs = require('fs');
var parseArgs = require('minimist');
var generateHmac = require('../src/hmac-generator');
var generateAes= require('../src/aes-generator');
var key, options, file, alg, encoding, code;

function showUsage() {
    console.log('Usage:'); 
    console.log('  jcrypto [options]');
    console.log();
    console.log('Available options:');
    console.log();
    console.log('   -a <algorithm>, --algorithm <algorithm>  Crypto algorithm. Posible values: aes, hmac. ');
    console.log('   -h, --help                               Display this help.');
    console.log('   -k <key>, --key=<key>                    Secret key.');
    console.log('   -e <encoding>, --encoding=<encoding>     Key characters encoding. Posible values: hex.');
    console.log('   -o <file>, --output=<file>               Output <file>.');
    console.log();
    process.exit(1);
};

var params = {
    string: ['e', 'encoding', 'o', 'output', 'k', 'key', 'a', 'algorithm'],
    boolean: ['h', 'help'],
    stopEarly: true,
    unknown: showUsage
};

if (process.argv.length <= 2) {
    showUsage();
}

var args = parseArgs(process.argv.slice(2), params);

if (args['h'] || args['help']) {
    showUsage();
}

key = args['k'] || args ['key'];
alg = args['a'] || ['algrithm'];
file = args.o || args.output || alg + '.js';
encoding = args.e || args['encoding'];

if (alg === 'aes') {
    code = generateAes(key, {
        file: file,
        encoding: encoding
    });
}
if (alg === 'hmac') {
    code = generateHmac(key, {
        file: file,
        encoding: encoding
    });
}
fs.writeFileSync(file, code);
console.log('Generated module: ' + file);
