var hexEncode = function(s) {
    var hex = '', i, len;
    for (i = 0, len = s.length; i < len; i++) {
        hex += s.charCodeAt(i).toString(16);
    }
    return hex;
};

module.exports = [
    /*
     * The following tests are used jsSHA tool.
     * The key is the same for all tests.
     * Key: abcdefABCDEFaAbBcCdDeEfF1234567890~!@#$%^&*()_+
     */
    {
        name: 'jsSHA-based Test #1',
        params: {
            data: '',
            hash: 'd3a5bd70c0b5394e7eb7b08662b7b8d8e77501edfbd5add0a4180aa0255ac523'
        }
    },
    {
        name: 'jsSHA-based Test #2',
        params: {
            data: hexEncode('a'),
            hash: 'd3a143104274b6be6e00887521a81cd7eb6171fddae3fd80742224e551300c11'
        }
    },
    {
        name: 'jsSHA-based Test #3',
        params: {
            data: hexEncode('A'),
            hash: 'a20b9e9291bb27c478e23d12eede7b0989aee0a5966861a511b907438db77c25'
        }
    },
    {
        name: 'jsSHA-based Test #4',
        params: {
            data: hexEncode('@'),
            hash: '05ed99fbee098933228ad56cf07c3e21ee25bac541341eaf4017e299699ffb81'
        }
    },
    {
        name: 'jsSHA-based Test #5',
        params: {
            data: '610d0a410d0a620d0a42',
            hash: 'd1dac2232921c42f29b6ee7a1bfbc6704b47d415c4cb7c7a945cd5d5460bd762'
        }
    },
    {
        name: 'jsSHA-based Test #6',
        params: {
            data: hexEncode('aaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAA'),
            hash: 'ee21393a87909e5945b2fceb33440ca87856094e62f987f3a476f3647e565895'
        }
    },
    {
        // Some custom HMAC tests
        name: 'Empty input HMAC',
        params: {
            data: '',
            hash: 'd3a5bd70c0b5394e7eb7b08662b7b8d8e77501edfbd5add0a4180aa0255ac523'
        }
    }
];
