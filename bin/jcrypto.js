#!/usr/bin/env node

var fs = require('fs'),
    parseArgs = require('minimist'),
    generateHmac = require('../src/hmac-generator'),
    generateAes = require('../src/aes-generator');

var key, file, alg, encoding, code, wrapper, mangle, mangleProps;

function showUsage() {
    console.log('Usage:');
    console.log('  jcrypto [options]');
    console.log();
    console.log('Available options:');
    console.log();
    console.log('   -a <algorithm>, --algorithm <algorithm>  Crypto algorithm. Posible values: aes, hmac');
    console.log('   -h, --help                               Display this help');
    console.log('   -k <key>, --key <key>                    Secret key');
    console.log('   -e <encoding>, --encoding <encoding>     Key characters encoding. Posible values: hex or str');
    console.log('   -o <file>, --output <file>               Output <file>');
    console.log('   -w <wrapper>, --wrapper <wrapper>        Wrapper. Posible values: UMD, IIFE');
    console.log('   -m, --mangle                             Mangle names');
    console.log('   -p, --mangle-props                       Mangle properties, cache name file aes-cache.js or hmac-cach.js');
    console.log();
}

var params = {
    string: ['e', 'encoding', 'o', 'output', 'k', 'key', 'a', 'algorithm', 'w', 'wrapper'],
    boolean: ['h', 'help', 'm', 'mangle', 'p', 'mangle-props'],
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

key = args['k'] || args['key'];
alg = args['a'] || ['algrithm'];
file = args['o'] || args['output'] || alg + '.js';
encoding = args['e'] || args['encoding'] || 'str';
wrapper = args['w'] || args['wrapper'] || 'def';
mangle = args['m'] || args['mangle'];
mangleProps = args['p'] || args['mangle-props'];

if (alg === 'aes') {
    code = generateAes(key, {
        file: file,
        encoding: encoding,
        wrapper: wrapper,
        mangle: {
            names: mangle,
            properties: mangleProps
        }
    });
}
if (alg === 'hmac') {
    code = generateHmac(key, {
        file: file,
        encoding: encoding,
        wrapper: wrapper,
        mangle: {
            names: mangle,
            properties: mangleProps
        }
    });
}
fs.writeFileSync(file, code);
console.log('Generated module: ' + file);
