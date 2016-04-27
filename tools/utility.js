(function utility() {
    'use strict';
    
    // generateNextName

    var NameSequence = void 0,
        ZeroSequenceCache = void 0;

    var stringRepeat = function stringRepeat(str, num) {
        var result = '';

        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }

        return result;
    };

    ZeroSequenceCache = [];

    var zeroSequence = function zeroSequence(num) {
        var res = ZeroSequenceCache[num];
        if (res !== undefined) {
            return res;
        }
        res = stringRepeat('0', num);
        ZeroSequenceCache[num] = res;
        return res;
    };

    NameSequence = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    var generateNextName = function generateNextName(name) {
        var cur = name.length - 1;
        do {
            var ch = void 0,
                index = void 0;
            ch = name.charAt(cur);
            index = NameSequence.indexOf(ch);
            if (index !== NameSequence.length - 1) {
                return name.substring(0, cur) + NameSequence[index + 1] + zeroSequence(name.length - (cur + 1));
            }
            --cur;
        } while (cur >= 0);
        return 'a' + zeroSequence(name.length);
    };

    // generateRandomString

    var generateRandomString = function generateRandomString(len) {
        return Array.apply(0, new Array(len)).map(function() {
                return (function(charset){
                    return charset.charAt(Math.floor(Math.random() * charset.length));
                }('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'));
            }).join('');
    };

    // generateRandomInteger

    var generateRandomInteger =  function generateRandomInteger(minimum, maximum){
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    };

    // hexEncode

    var hexEncode = function(s){
        var hex = '', i, len;
        for (i = 0, len = s.length; i < len; i++) {
            hex += s.charCodeAt(i).toString(16);
        }
        return hex;
    };

    module.exports = {
        generateNextName: generateNextName,
        generateRandomString: generateRandomString,
        generateRandomInteger: generateRandomInteger,
        hexEncode: hexEncode
    };
})();