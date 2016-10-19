'use strict';
var hmac = {};
hmac.blockSize = 16;

/**
 * Calculate HMAC of meassge using SHA-256 hash function
 * @param   {string} Message.
 * @param   {object} Configuration object (read more at docs).
 * @returns {string} Hash value.
 */
hmac.hash = function(message, options) {
    if(typeof (options) !== 'object') {
        options = {};
    }
    // Decode message if necessary
    switch (options.encoding) {
        case 'hex':
            message = hmac.h2s(message);
            break;
        default:
            message = hmac.utf8Encode(message);
    }
    // Using key padded w/ ipad
    var toHash = hmac.prepareMessage(message);
    var hashState = hmac.states[0].slice();
    var hashBytes = hmac.hashBytes(toHash, hashState);
    // Using key padded w/ opad
    toHash = hmac.prepareMessage(hmac.a2s(hashBytes));
    hashState = hmac.states[1].slice();
    hashBytes = hmac.hashBytes(toHash, hashState);
    var hash = '';
    // Encode hash value if necessary. Hex output is default
    switch (options.encoding) {
        case 'hex':
            hash = hmac.a2h(hashBytes);
            break;
        case 'binary':
            hash = hmac.a2s(hashBytes);
            break;
        default:
            hash = hmac.a2h(hashBytes);
    }
    return hash;
};

/**
 * Convert string msg into 512-bit/hmac.blockSize-integer blocks arrays of ints [§5.2.1]
 * @param   {string}                     Message
 * @returns {number[[]*hmac.blockSize]}  Array of blocks each of which consits of hmac.blockSize integers.
 */
hmac.prepareMessage = function(msg) {
    // add trailing '1' bit (+ 0's padding) to string [§5.1.1]
    msg += String.fromCharCode(0x80);
    // length (in 32-bit integers) of padded msg
    // + 2 integers of appended length
    // + hmac.blockSize integers of already hashed HMAC key block
    var msgLen = (msg.length / 4) + 2;
    // number of hmac.blockSize-integer-blocks required to hold l ints
    var nBlocks = Math.ceil(msgLen / hmac.blockSize);
    var M = [];
    var i, j;
    for (i = 0; i < nBlocks; i++) {
        M[i] = [];
        // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        for (j = 0; j < hmac.blockSize; j++) {
            // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt((i * 64) + (j * 4)) << 24)   |
                        (msg.charCodeAt((i * 64) + (j * 4) + 1) << 16) |
                        (msg.charCodeAt((i * 64) + (j * 4) + 2) << 8)  |
                        (msg.charCodeAt((i * 64) + (j * 4) + 3));
        }
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    var byteLen = msg.length + (hmac.blockSize * 4) - 1;
    M[nBlocks - 1][hmac.blockSize - 2] = (byteLen * 8) / Math.pow(2, 32);
    M[nBlocks - 1][hmac.blockSize - 2] = Math.floor(M[nBlocks - 1][hmac.blockSize - 2]);
    M[nBlocks - 1][hmac.blockSize - 1] = (byteLen * 8) & 0xffffffff;
    return M;
};

/**
 * Hash a block of prepared bytes using SHA-256 [§6.1.2]
 * @param   {number[[]*hmac.blockSize]} Array of integer blocks get from prepared message
 * @param   {number[]}                  Hash state object.
 * @returns {number[]}                  Resulting hash state object.
 */
hmac.hashBytes = function(blocks, state) {
    var W = [];
    var a, b, c, d, e, f, g, h, i, j;
    var nBlocks = blocks.length;
    for (i = 0; i < nBlocks; i++) {
        // 1 - prepare message schedule 'W'
        for (j = 0;  j < hmac.blockSize; j++) {
            W[j] = blocks[i][j];
        }
        for (j = hmac.blockSize; j < 64; j++) {
            W[j] = (hmac.t1(W[j - 2]) + W[j - 7] + hmac.t0(W[j - 15]) + W[j - 16]);
            W[j] &= 0xffffffff;
        }
        // 2 - initialise working variables a, b, c, d, e, f, g, h with state values
        a = state[0];
        b = state[1];
        c = state[2];
        d = state[3];
        e = state[4];
        f = state[5];
        g = state[6];
        h = state[7];
        // 3 - main loop (note 'addition modulo 2^32')
        for (j = 0; j < 64; j++) {
            var T1 = h + hmac.s1(e) + hmac.ch(e, f, g)  + hmac.K[j] + W[j];
            var T2 =     hmac.s0(a) + hmac.maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }
        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        state[0] = (state[0] + a) & 0xffffffff;
        state[1] = (state[1] + b) & 0xffffffff;
        state[2] = (state[2] + c) & 0xffffffff;
        state[3] = (state[3] + d) & 0xffffffff;
        state[4] = (state[4] + e) & 0xffffffff;
        state[5] = (state[5] + f) & 0xffffffff;
        state[6] = (state[6] + g) & 0xffffffff;
        state[7] = (state[7] + h) & 0xffffffff;
    }
    return state;
};

/**
 * Rotates right (circular right shift) value x by n positions [§3.2.4].
 */
hmac.rotr = function(n, x) {
    return (x >>> n) | (x << (32 - n));
};

/**
 * Logical functions [§4.1.2].
 */
hmac.s0  = function(x) {
    return hmac.rotr(2,  x) ^ hmac.rotr(13, x) ^ hmac.rotr(22, x);
};
hmac.s1  = function(x) {
    return hmac.rotr(6,  x) ^ hmac.rotr(11, x) ^ hmac.rotr(25, x);
};
hmac.t0  = function(x) {
    return hmac.rotr(7,  x) ^ hmac.rotr(18, x) ^ (x >>> 3);
};
hmac.t1  = function(x) {
    return hmac.rotr(17, x) ^ hmac.rotr(19, x) ^ (x >>> 10);
};
hmac.ch  = function(x, y, z) {
    return (x & y) ^ (~x & z);
};
hmac.maj = function(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
};

/**
     * Constants [§4.2.2]
    */
hmac.K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

/**
 * Encode a string to UTF-8
 * @param   {string} Input string.
 * @throws  {Error}  Error on UTF-8 encode
 * @returns {string} Encoded string.
 */
hmac.utf8Encode = function(str) {
    try {
        var i, charcode, strLen, utf8Len;
        var res = '', utf8 = [];
        for (i = 0, strLen = str.length; i < strLen; i++) {
            charcode = str.charCodeAt(i);
            if (charcode < 0x80) {
                utf8.push(charcode);
            } else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                            0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                            0x80 | ((charcode >> 6) & 0x3f),
                            0x80 | (charcode & 0x3f));
            } else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                                        (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                            0x80 | ((charcode >> 12) & 0x3f),
                            0x80 | ((charcode >> 6) & 0x3f),
                            0x80 | (charcode & 0x3f));
            }
        }
        // Finally pack it to string
        for (i = 0, utf8Len = utf8.length; i < utf8Len; i++) {
            res += String.fromCharCode(utf8[i]);
        }
        return res;
    } catch(e) {
        throw new Error('Error on UTF-8 encode');
    }
};

/**
 * Transfrom integer into array of bytes
 */
hmac.i2b = function(n) {
    var bytes = [], i;
    for (i = 3; i >= 0; i--) {
        bytes[3 - i] = (n >>> (i * 8)) & 0xff;
    }
    return bytes;
};

/**
 * Transfrom an array of integers into a string
 */
hmac.a2s = function(numArr) {
    var string = '', i, j, arrLen, block, bLen;
    for (i = 0, arrLen = numArr.length; i < arrLen; i++) {
        block = hmac.i2b(numArr[i]);
        for (j = 0, bLen = block.length; j < bLen; j++) {
            string += String.fromCharCode(block[j]);
        }
    }
    return string;
};

/**
 * Transfrom an array of integers into a hex string
 */
hmac.a2h = function(numArr) {
    var str = '', i, block, j, arrLen, bLen;
    for (i = 0, arrLen = numArr.length; i < arrLen; i++) {
        block = hmac.i2b(numArr[i]);
        for (j = 0, bLen = block.length; j < bLen; j++) {
            str += (block[j] < 16 ? '0' : '') + block[j].toString(16);
        }
    }
    return str;
};

/**
 * Decode string from hex representation
 * @throws  {Error}  Error on hex decode
 */
hmac.h2s = function(hexStr) {
    if (hexStr.length === 0) {
        return '';
    }
    if (hexStr.length % 2 === 1) {
        throw Error('Odd-length string');
    }

    var res = '', i;
    var hexCodes = hexStr.match(/[0-9a-f]{2}/gi);
    var len = hexCodes.length;
    for (i = 0; i < len; i++) {
        res += String.fromCharCode(parseInt(hexCodes[i], 16));
    }
    return res;
};
