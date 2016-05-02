(function wbaesTemplate(){
    'use strict';
    var Aes = {};
    Aes.blockSize = 16;
    Aes.nBits = 128;

    /**
     * Encode a string to UTF-8
     * @param   {string} Input string.
     * @throws  {Error}  Error on UTF-8 encode
     * @returns {string} Encoded string.
     */
    Aes.utf8Encode = function(s) {
        try {
            return encodeURIComponent(s);
        }
        catch(e) {
            throw new Error('Error on UTF-8 encode');
        }
    };

    /**
     * Decode a string from UTF-8
     * @param   {string} Input string.
     * @throws  {Error}  Error on UTF-8 decode
     * @returns {string} Decoded string.
     */
    Aes.utf8Decode = function(s) {
        try {
            return decodeURIComponent(s);
        }
        catch(e) {
            throw new Error('Error on UTF-8 decode');
        }
    };

    /**
     * Transfrom an array of char codes into a string
     * @param   {[number]}  Array of char codes.
     * @returns {string}    Resulting string.
     */
    Aes.a2s = function(numArr) {
        var string = '';
        for (var i = 0, len = numArr.length; i < len; i++) {
            string += String.fromCharCode(numArr[i]);
        }
        return string;
    };

    /**
     * Transfrom a string into an array of char codes
     * @param   {string}    Input string
     * @returns {[number]}  Array of char codes.
     */
    Aes.s2a = function(str) {
        var array = new Array(str.length);
        for (var i = 0, len = str.length; i < len; i++) {
            array[i] = str.charCodeAt(i);
        }
        return array;
    };

    /**
     * Transform an array of char codes into a hex encoded string
     * @param   {[number]}  Input array.
     * @returns {string}    Hex encoded string.
     */
    Aes.a2h = function(numArr) {
        var hexstring = '';
        for (var i = 0, len = numArr.length; i < len; i++) {
            hexstring += (numArr[i] < 16 ? '0': '') + numArr[i].toString(16);
        }
        return hexstring;
    };

    /**
     * Transfrom a hex encoded string into an array of char codes
     * @param   {string}    Hex encoded string
     * @returns {[number]}  Array of char codes.
     */
    Aes.h2a = function(str) {
        var hexCodes = str.match(/[0-9a-f]{2}/gi), len = hexCodes.length;
        var array = new Array(len);
        for (var i = 0; i < len; i++) {
            array[i] = parseInt(hexCodes[i],16);
        }
        return array;
    };

    /**
     * Encrypt a text using AES encryption in Counter mode of operation.
     * @param   {string} Source text to be encrypted.
     * @param   {object} Configuration object (read more at docs).
     * @returns {string} Encrypted text.
     */
    Aes.encrypt = function(plaintext, configuration) {
        if (typeof(configuration) === 'undefined') {
            configuration = {};
        }

        var counter, ciphertext;
        var counterBlock = [];
        // Choose a way to initialise counter block
        if (configuration.hasOwnProperty('counter')) {
            counter = Aes.h2a(configuration.counter);
            if (counter.length !== Aes.blockSize) {
                throw new Error('Counter must be ' + Aes.blockSize + ' hex encoded bytes');
            }
            counterBlock = counter.slice();
        } else {
            counterBlock = Aes.initDefaultCounter();
        }
        // Store it to go on the front of the ciphertext
        counter = counterBlock.slice();

        // Decode plaintext if necessary
        switch (configuration.encoding) {
            case 'binary':
                plaintext = Aes.s2a(plaintext);
                break;
            case 'hex':
                plaintext = Aes.h2a(plaintext);
                break;
            default:
                plaintext = Aes.s2a(Aes.utf8Encode(plaintext));
        }

        ciphertext = Aes.encryptBytes(plaintext, counterBlock);
        ciphertext = counter.concat(ciphertext);

        // Encode ciphertext if necessary
        switch (configuration.encoding) {
            case 'hex':
                ciphertext = Aes.a2h(ciphertext);
                break;
            default:
                ciphertext = Aes.a2s(ciphertext);
        }

        return ciphertext;
    };

    /**
     * Initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2)
     *      [0-1] = millisec, [2-3] = random, [4-7] = seconds,
     *      together giving full sub-millisec uniqueness up to Feb 2106
     * @returns {[number]} counter block.
     */
    Aes.initDefaultCounter = function (){
        var i, counterBlock = [];
        for (i = 0; i < Aes.blockSize; i++){
            counterBlock[i] = 0;
        }

        var nonce = (new Date()).getTime();
        var nonceMs = nonce % 1000;
        var nonceSec = Math.floor(nonce / 1000);
        var nonceRnd = Math.floor(Math.random() * 0xffff);

        for (i = 0; i < 2; i++) {
            counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
        }
        for (i = 0; i < 2; i++) {
            counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
        }
        for (i = 0; i < 4; i++) {
            counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
        }

        return counterBlock;
    };

    /**
     * Encrypt bytes using provided AES algorithm.
     * @param   {[number]} Plaintext bytes.
     * @param   {[number]} Counter block.
     * @returns {[number]} Encrypted bytes.
     */
    Aes.encryptBytes = function(plaintext, counterBlock) {
        var b, i;
        var nBlocks = Math.ceil(plaintext.length / Aes.blockSize);
        var ciphertext = [];

        for (b = 0; b < nBlocks; b++) {
            var encryptedCntr = Aes.encryptBlock(counterBlock);

            // Block size is reduced on final block
            var blockLength = b < (nBlocks - 1) ? Aes.blockSize : (plaintext.length - 1) % Aes.blockSize + 1;
            var encryptedChars = [];
            for (i = 0; i < blockLength; i++) {
                encryptedChars[i] = encryptedCntr[i] ^ plaintext[b * Aes.blockSize + i];
            }
            ciphertext = ciphertext.concat(encryptedChars);

            // Set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            // Done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
            for (i = 15; i >= 8; i--) {
                if (counterBlock[i] === 0xff) {
                    counterBlock[i] = 0;
                }
                else {
                    counterBlock[i]++;
                    break;
                }
            }
        }
        return ciphertext;
    };

    /**
     * Decrypt a text encrypted by AES in counter mode of operation
     * @param   {string} Cipher text to be decrypted.
     * @param   {object} Configuration object (read more at docs).
     * @returns {string} Decrypted text
     */
    Aes.decrypt = function(ciphertext, configuration) {
        if (typeof(configuration) === 'undefined') {
            configuration = {};
        }

        // Decode ciphertext if necessary
        switch (configuration.encoding) {
            case 'hex':
                ciphertext = Aes.a2s(Aes.h2a(ciphertext));
                break;
            default:
                // Default is binary string
                break;
        }

        // Recover nonce from 1st 16 bytes of ciphertext
        var ctrTxt = ciphertext.slice(0, Aes.blockSize);
        var counterBlock = Aes.s2a(ctrTxt);

        var plaintextBytes = Aes.decryptBytes(ciphertext, counterBlock);

        // Encode if necessary
        var plaintext = '';
        switch (configuration.encoding) {
            case 'binary':
                plaintext = Aes.a2s(plaintextBytes);
                break;
            case 'hex':
                plaintext = Aes.a2h(plaintextBytes);
                break;
            default:
                plaintext = Aes.utf8Decode(Aes.a2s(plaintextBytes));
        }

        return plaintext;
    };

    /**
     * Decrypt bytes using provided AES algorithm.
     * @param   {[number]} Encrypted bytes.
     * @param   {[number]} Counter block.
     * @returns {[number]} Decrypted bytes.
     */
    Aes.decryptBytes = function(ciphertext, counterBlock) {
        var i, b;
        var offset = Aes.blockSize;

        // Separate ciphertext into blocks (skipping past initial 8 bytes)
        var nBlocks = Math.ceil((ciphertext.length - offset) / Aes.blockSize);
        var ct = [];
        for (b = 0; b < nBlocks; b++) {
            ct[b] = Aes.s2a(ciphertext.slice(offset + b*Aes.blockSize, offset + (b+1)*Aes.blockSize));
        }
        ciphertext = ct;  // ciphertext is now array of block-length char code arrays

        var plaintextBytes = [];
        for (b = 0; b < nBlocks; b++) {
            var cipherCntr = Aes.encryptBlock(counterBlock);

            var blockBytes = new Array(ciphertext[b].length);
            for (i = 0; i < ciphertext[b].length; i++) {
                blockBytes[i] = cipherCntr[i] ^ ciphertext[b][i];
            }
            plaintextBytes = plaintextBytes.concat(blockBytes);

            // Set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            for (i = 15; i >= 8; i--) {
                if (counterBlock[i] === 0xff) {
                    counterBlock[i] = 0;
                }
                else {
                    counterBlock[i]++;
                    break;
                }
            }
        }

        return plaintextBytes;
    };

    /*
     * Shift row r of state S left by r bytes [§5.1.2]
     */
    Aes.shiftRows = function(state) {
        // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
        var rows = new Array(4);
        for (var i = 0; i < rows.length; i++) {
            rows[i] = state[i].slice(i).concat(state[i].slice(0,i));
        }
        return rows;
    };

    /**
     * AES Cipher function: encrypt bytes with Rijndael algorithm [§5.1];
     * @param   {number[]} Input array.
     * @returns {number[]} Encrypted output array.
     */
    Aes.encryptBlock = function(byteBlock) {
        var Nr = 10, round;
        var state = Aes.formState(byteBlock);

        for (round = 1; round < Nr; round++) {
            state = Aes.shiftRows(state);
            state = Aes.applyTBoxes(state, round);
            state = Aes.applyTyTables(state);
        }
        state = Aes.shiftRows(state);
        state = Aes.applyTBoxes(state, round);

        return Aes.getBytes(state);
    };

    /**
     * Form bytes into state array
     * @param   {number[]} Input bytes array.
     * @returns {number[[]*4]} State array.
     */
    Aes.formState = function(byteBlock) {
        var nWords = Aes.blockSize / 4;
        var state = [[],[],[],[]];
        var i, j;
        for (i = 0; i < nWords; i++) {
            for(j = 0; j < 4; j++) {
                state[j][i] = byteBlock[i * 4 + j];
            }
        }
        return state;
    };

    /**
     * Extract bytes from the state array
     * @param   {number[[]*4]} Input state array.
     * @returns {number[} Bytes array.
     */
    Aes.getBytes = function(state) {
        var i, j, len;
        var bytes = [];
        for (i = 0, len=state.length; i < len; i++) {
            for(j = 0; j < 4; j++) {
                bytes[i * 4 + j] = state[j][i];
            }
        }
        return bytes;
    };


    /**
     * Aplies transform to the state array using TBoxes
     * @param   {number[[]*4]} Input state array.
     * @param   {number}             Number of current round
     * @returns {number[[]*4]} Transformed output state array.
     */
    Aes.applyTBoxes = function(state, round) {
        var row, col, nByte, curByte;
        var TBox = Aes.TBoxes[round];
        for (row = 0; row < 4; row++) {
            for (col = 0; col < 4; col++ ) {
                nByte = row * 4 + col;
                curByte = state[row][col];
                state[row][col] = TBox[nByte][curByte];
            }
        }
        return state;
    };

    /**
     * Returns word1 XOR word2
     * @param  {number[]} Word arrays.
     * @returns {number[]} Result array.
     */
    Aes.xorWords = function(word1, word2) {
        var i, len = word1.length;
        var res = [];
        for (i = 0; i < len; i++) {
            res[i] = (word1[i] ^ word2[i])  % 256;
        }
        return res;
    };

    /**
     * Aplies transform to the state array using TyTables
     *        - There are 4 TyTables - 1 for every row of the state.
     *        - TyTables map 1 byte to 4 bytes, so we need to XOR the outputs to get resulting column
     * @param   {number[[]*4]} Input state array.
     * @returns {number[[]*4]} Transformed output state array.
     */
    Aes.applyTyTables = function(state) {
        // All computations are aplied to the column vector, as with fixed column No
        var col, newColumn, TyTable, curByte, row;
        for (col = 0; col < 4; col++) {
            newColumn = [0, 0, 0, 0];
            // Compute new column vector
            for (row = 0; row < 4; row++) {
                TyTable = Aes.TyTables[row];
                curByte = state[row][col];
                newColumn = Aes.xorWords(newColumn, TyTable[curByte]);
            }
            // Arrange it in the state
            for (row = 0; row < 4; row++ ) {
                state[row][col] = newColumn[row];
            }
        }
        return state;
    };
    module.exports.encrypt = Aes.encrypt;
    module.exports.decrypt = Aes.decrypt;
}());
