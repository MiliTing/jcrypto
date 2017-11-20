# jCrypto
These are experimental white-box cryptography tools for JavaScript obfuscation. Please do not use them in production cryptography.

## Threat Model
The goal of `jCrypto` is to provide white-box cryptographic algorithms for JavaScript obfuscation on a client-side in browsers.
An attacker can run protected scripts in a controlled browser, he can examine arbitrary input, output, and he can also use browser's debugger, change scripts' code, etc. The attacker has total control over cryptographic operations and scripts execution.
This is very strong threat model.

`jCrypto` is a research project and it can not be used to provide classic cryptography properties.

`jCrypto` implements a new white-box HMAC-SHA256 algorithm proposed by our team [[2](http://www.mathnet.ru/links/31303c3ca85d02fecff4f980a844ddc1/pdma275.pdf)]. 
It is very likely that proposed white-box HMAC scheme has cryptographic weaknesses. So, we will be happy if you will report found issues to us.

`jCrypto` implements a weak table-based AES-encryption without additional encoding and protecting of AES secret key. An attacker can compute the key directly [[3](https://eprint.iacr.org/2013/104.pdf)].


## Algorithms
- white-box AES128-CTR (table-based implementation)
- white-box HMAC-SHA256 (own algorithm)

## Installation
```bash
npm install jcrypto
```
or
```bash
git clone https://github.com/tsu-iscd/jcrypto.git
cd jcrypto
npm install
```

## Tests
After installation run:

```
npm test
```
or

```
grunt
```

## API

### Code generation

```node
var key = '0123456789abcdef';
var jcrypto = require('jcrypto');
var options = {  
    encoding: 'hex',
    wrapper: 'UMD',
    mangle: {  
        names: true,
        properties: true
   },
   file: 'path/to/aes.js'
};
// btw you can call it without options argument, default options described below
jcrypto.generateAes(key, options);

options.file = 'path/to/hmac.js';
jcrypto.generateHmac(key, options);
```

Code generation options:
* `encoding` -- key characters encoding; posible values: `hex` or `str` (default)
* `wrapper` --  code wrapping; posible values: `UMD`, `IIFE` or nothing (default)
* `mangle` -- mangle names/properties option, properties cache file `./aes-cache.json` for aes and `./hmac-cache.json` for hmac; possible values: `{names: true, properties: true}` (default both false)
* `file` -- output file option; path to file or return value (default)

### Encryption

```node
var aes = require('path/to/aes.js');
var plaintext = 'Hello, world!';
var options = {
    counter: '1826e4111826e4111826e4111826e411', 
    encoding: 'str'
};
var ciphertext = aes.encrypt(plaintext, options);
var output = aes.decrypt(ciphertext, options);
// Hello, world!
```

Encryption options:

* `counter` -- counter for CTR AES mode; string 32 symbols (default 0)
* `encoding` -- plain text or encrypt text encoding; posible values are `hex` or `str`(default)


### Hashing

```node
var hash = require('path/to/hmac.js');
var text = 'Hello, world!';
var options = {
    encoding: 'str'
}
var output = hash(text, options);
// 8dcb6767c395b28b46ea0f0216cb3aa25b6ff46f0181ab035f3cf7fd3914c45e
```

Hashing options:
* `encoding` -- text encoding; posible values are `hex` or `str`(default)


## Command line interface

The `bin/jcrypto` utility can be used to generate code of white-box crypto algorithm. It accepts as arguments its secret key, output file and the following options:

* `-a, --algorithm` -  crypto algorithms: aes, hmac.
* `-h, --help` -  display help.
* `-k, --key` - secret key.
* `-e, --encoding` - key characters encoding; posible values: hex.
* `-o, --output` - output file.

Example:

```bash
$ bin/jcrypto -a aes -k 1234567891234567 -o wbaes.js
```


## Contributors
- Denis Kolegov
- Oleg Broslavsky
- Nikita Oleksov

## References
1. [En] [Oleg Broslavsky, Denis Kolegov, Nikita Oleksov. White-Box HMAC.] (http://www.slideshare.net/yalegko/whitebox-hmac-make-your-cipher-secure-to-whitebox-attacks)
2. [Ru] [Oleg Broslavsky, Denis Kolegov, Nikita Oleksov. HMAC Obfuscation Method for Implementation in Untrusted Systems. ](http://www.mathnet.ru/links/31303c3ca85d02fecff4f980a844ddc1/pdma275.pdf)
3. [James A. Muir. A Tutorial on White-box AES.](https://eprint.iacr.org/2013/104.pdf)
4. [S. Chow, P. Eisen, H. Johnson, P.C. van Oorschot. White-Box Cryptography and an AES Implementation.] (http://dl.acm.org/citation.cfm?id=694920)
