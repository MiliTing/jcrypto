(function() {
    'use strict';

    var fs = require('fs'),
        esprima = require('esprima'),
        escodegen = require('escodegen'),
        mangle = require('./mangler.js'),
        wrapper = require('./wrapper.js'),
        path = require('path');

    var sha256 = {}, hmac = {};

    sha256.K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    sha256.hash = function(msg) {
        msg += String.fromCharCode(0x80);
        var i, j, t, T1, T2;
        var H = [
            0x6a09e667,
            0xbb67ae85,
            0x3c6ef372,
            0xa54ff53a,
            0x510e527f,
            0x9b05688c,
            0x1f83d9ab,
            0x5be0cd19
        ];
        var l = (msg.length / 4) + 2;
        var N = Math.ceil(l / 16);
        var M = [];
        for (i = 0; i < N; i++) {
            M[i] = [];
            for (j = 0; j < 16; j++) {
                M[i][j] = (msg.charCodeAt((i * 64) + (j * 4)) << 24) | (msg.charCodeAt((i * 64) + (j * 4) + 1) << 16) |
                          (msg.charCodeAt((i * 64) + (j * 4) + 2) << 8) | (msg.charCodeAt((i * 64) + (j * 4) + 3));
            }
        }
        M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
        M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;
        
        var W = [];
        var a, b, c, d, e, f, g, h;
        for (i = 0; i < N; i++) {
            for (t = 0;  t < 16; t++) {
                W[t] = M[i][t];
            }
            for (t = 16; t < 64; t++) {
                W[t] = (sha256.σ1(W[t - 2]) + W[t - 7] + sha256.σ0(W[t - 15]) + W[t - 16]) & 0xffffffff;
            }
            
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];

            for (t = 0; t < 64; t++) {
                T1 = h + sha256.s1(e) + sha256.ch(e, f, g) + sha256.K[t] + W[t];
                T2 = sha256.s0(a) + sha256.maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }

            H[0] = (H[0] + a) & 0xffffffff;
            H[1] = (H[1] + b) & 0xffffffff;
            H[2] = (H[2] + c) & 0xffffffff;
            H[3] = (H[3] + d) & 0xffffffff;
            H[4] = (H[4] + e) & 0xffffffff;
            H[5] = (H[5] + f) & 0xffffffff;
            H[6] = (H[6] + g) & 0xffffffff;
            H[7] = (H[7] + h) & 0xffffffff;
        }
        return sha256.toHexStr(H[0]) + sha256.toHexStr(H[1]) + sha256.toHexStr(H[2]) + sha256.toHexStr(H[3]) +
               sha256.toHexStr(H[4]) + sha256.toHexStr(H[5]) + sha256.toHexStr(H[6]) + sha256.toHexStr(H[7]);
    };

    sha256.initHash = function(msg) {
        var i, j, t, T1, T2;
        var H = [
            0x6a09e667,
            0xbb67ae85,
            0x3c6ef372,
            0xa54ff53a,
            0x510e527f,
            0x9b05688c,
            0x1f83d9ab,
            0x5be0cd19
        ];
        var l = msg.length / 4;
        var N = Math.ceil(l / 16);
        var M = [];
        for (i = 0; i < N; i++) {
            M[i] = [];
            for (j = 0; j < 16; j++) {
                M[i][j] = (msg.charCodeAt((i * 64) + (j * 4)) << 24) | (msg.charCodeAt((i * 64) + (j * 4) + 1) << 16) |
                          (msg.charCodeAt((i * 64) + (j * 4) + 2) << 8) | (msg.charCodeAt((i * 64) + (j * 4) + 3));
            }
        }
        var W = [];
        var a, b, c, d, e, f, g, h;
        for (i = 0; i < N; i++) {
            for (t = 0;  t < 16; t++) {
                W[t] = M[i][t];
            }
            for (t = 16; t < 64; t++) {
                W[t] = (sha256.σ1(W[t - 2]) + W[t - 7] + sha256.σ0(W[t - 15]) + W[t - 16]) & 0xffffffff;
            }
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];

            for (t = 0; t < 64; t++) {
                T1 = h + sha256.s1(e) + sha256.ch(e, f, g) + sha256.K[t] + W[t];
                T2 = sha256.s0(a) + sha256.maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }
            H[0] = (H[0] + a) & 0xffffffff;
            H[1] = (H[1] + b) & 0xffffffff;
            H[2] = (H[2] + c) & 0xffffffff;
            H[3] = (H[3] + d) & 0xffffffff;
            H[4] = (H[4] + e) & 0xffffffff;
            H[5] = (H[5] + f) & 0xffffffff;
            H[6] = (H[6] + g) & 0xffffffff;
            H[7] = (H[7] + h) & 0xffffffff;
        }
        return H;
    };

    sha256.rotr = function(n, x) {
        return (x >>> n) | (x << (32 - n));
    };

    sha256.s0  = function(x) {
        return sha256.rotr(2,  x) ^ sha256.rotr(13, x) ^ sha256.rotr(22, x);
    };

    sha256.s1  = function(x) {
        return sha256.rotr(6,  x) ^ sha256.rotr(11, x) ^ sha256.rotr(25, x);
    };

    sha256.σ0  = function(x) {
        return sha256.rotr(7,  x) ^ sha256.rotr(18, x) ^ (x >>> 3);
    };

    sha256.σ1  = function(x) {
        return sha256.rotr(17, x) ^ sha256.rotr(19, x) ^ (x >>> 10);
    };

    sha256.ch  = function(x, y, z) {
        return (x & y) ^ (~x & z);
    };

    sha256.maj = function(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    };

    sha256.toHexStr = function(n) {
        var s = '', v;
        for (var i = 7; i >= 0; i--) {
            v = (n >>> (i * 4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    };

    hmac.xor = function(a, b) {
        var i, blocksize = 64;
        var s = [];
        for(i = 0; i < blocksize; i++) {
            s.push(a[i] ^ b);
        }
        return s;
    };

    hmac.prepareKeyBlock = function(key) {
        var state = [];
        var blocksize = 64;
        var oKeyPad = [];
        var iKeyPad = [];
        var preparedKey = new Buffer(blocksize);
        preparedKey.fill(0);

        if(key.length > blocksize) {
            key = new Buffer(sha256.hash(key.toString('binary')), 'hex');
        }
        key.copy(preparedKey);

        oKeyPad = new Buffer(hmac.xor(preparedKey, 0x5c));
        iKeyPad = new Buffer(hmac.xor(preparedKey, 0x36));

        state[1] = sha256.initHash(oKeyPad.toString('binary'));
        state[0] = sha256.initHash(iKeyPad.toString('binary'));

        return state;
    };
   
    // Generate whitebox-hmac code and write it in a file
    hmac.generateAlgorithm = function(key, options) {
        var code, mixing, tree, state, body, i, len;

        options = options || {};

        if(options.encoding === 'hex') {
            key = new Buffer(key, 'hex');
        } else {
            key = new Buffer(key);
        }

        state = hmac.prepareKeyBlock(key);
        code = fs.readFileSync(path.join(__dirname, '/fixtures/hmac-template.js'), 'utf8');
        tree = esprima.parse(code);
        // Get module's body
        body = tree.body;
        // Delete original Aes declaration
        body.splice(0, 1);
        // Get parse tree for added code
        mixing =  esprima.parse(
            'var hmac = {};\n' +
            'hmac.states = ' + JSON.stringify(state) + ';'
        );
        // Add Aes declarations to tree
        for(i = 0, len = mixing.body.length; i < len; i++) {
            body.splice(i, 0, mixing.body[i]);
        }

        code = escodegen.generate(tree);
        
        if(options.wrapper) {
            options.returnValue = 'hmac.hash';
            options.windowObject = 'hmac';
            code = wrapper(code, options);
        }

        if(options.mangle) {
            options.mangle.filename = 'hmac-cache.json';
            code = mangle(code, options.mangle);
        }

        return code;
    };

    module.exports = hmac.generateAlgorithm;
}());
