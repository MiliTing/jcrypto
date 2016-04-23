'use strict';

var bAes = require('../wbaes.base.js'),
    oAes = require('../wbaes.obf.js');
//    mAes = require('../wbaes.min.js');
//var aesjs = require('aes-js');

function basicEncryptionTest(aes, text){
    return aes.decrypt(aes.encrypt(text));
}
/*
function extEncryptionTest(text, keyStr, ctr){
    var key = aesjs.util.convertStringToBytes(keyStr);
    var textBytes = aesjs.util.convertStringToBytes(text);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(ctr));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var cipherText = aesjs.util.convertBytesToString(encryptedBytes);
    return cipherText;
}
*/

module.exports = {
    'Base AES, english text' : function(test) {
        var text = 'You can do anything, but not everything.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },

    'Base AES, russian text' : function(test) {
        var text = 'Быть энтузиасткой сделалось ее общественным положением, и иногда, когда ей даже того не хотелось, она, чтобы не обмануть ожиданий людей, знавших ее, делалась энтузиасткой.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, empty text' : function(test) {
        var text = '';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, some special characters' : function(test) {
        var text = '!@#$%^&*()_+';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, NIST SP800-38a' : function(test) {
        /*
         * key:            2b7e151628aed2a6abf7158809cf4f3c
         * Init. Counter:  f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff
         * Plaintext:      6bc1bee22e409f96e93d7e117393172a
         * Ciphertext:     874d6191b620e3261bef6864990db6ce
         * http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
         */
        test.expect(1);
        test.strictEqual(bAes.encrypt('6bc1bee22e409f96e93d7e117393172a', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '874d6191b620e3261bef6864990db6ce');
        test.done();
    },
    'Base AES, Test vector 1' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('ae2d8a571e03ac9c9eb76fac45af8e51', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '42a155248663d02c6c6579d9af312fb5');
        test.done();
    },
    'Base AES, Test vector 2' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('30c81c46a35ce411e5fbc1191a0a52ef', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), 'dc44c3353b3c98a11729d76cf094f30b');
        test.done();
    },
    'Base AES, Test vector 3' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('f69f2445df4f9b17ad2b417be66c3710', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '1a13fb36472fe7a75ff9570e0cf296f4');
        test.done();
    },
    'Obfuscated AES, english text' : function(test) {
        var text = 'You can do anything, but not everything.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(oAes, text), text);
        test.done();
    },
    'Obfuscated AES, russian text' : function(test) {
        var text = 'Быть энтузиасткой сделалось ее общественным положением, и иногда, когда ей даже того не хотелось, она, чтобы не обмануть ожиданий людей, знавших ее, делалась энтузиасткой.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(oAes, text), text);
        test.done();
    },
    'Obfuscated AES, empty text' : function(test) {
        var text = '';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(oAes, text), text);
        test.done();
    },
    'Obfuscated AES, some special characters' : function(test) {
        var text = '!@#$%^&*()_+';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(oAes, text), text);
        test.done();
    },
    'Obfuscated AES, NIST SP800-38a' : function(test) {
        test.expect(1);
        test.strictEqual(oAes.encrypt('6bc1bee22e409f96e93d7e117393172a', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '874d6191b620e3261bef6864990db6ce');
        test.done();
    },
    'Obfuscated AES, Test vector 1' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(oAes.encrypt('ae2d8a571e03ac9c9eb76fac45af8e51', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '42a155248663d02c6c6579d9af312fb5');
        test.done();
    },
    'Obfuscated AES, Test vector 2' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(oAes.encrypt('30c81c46a35ce411e5fbc1191a0a52ef', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), 'dc44c3353b3c98a11729d76cf094f30b');
        test.done();
    },
    'Obfuscated AES, Test vector 3' : function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(oAes.encrypt('f69f2445df4f9b17ad2b417be66c3710', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '1a13fb36472fe7a75ff9570e0cf296f4');
        test.done();
    },
};