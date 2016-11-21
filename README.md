# jCrypto
These are an experimental white-box cryptography tools for JavaScript obfuscation.

## Threat Model
The attacker runs software on their own devices. They are able to examine its inputs, outputs, and, with the help of a browser debugger ), the result of every intermediate computation it carries out. The attacker has total visibility into the cryptographic operation.

## Security Goals
### Security Goals
JavaScript obfuscation using `AES` and `HMAC` on a client-side

### Non-Goals
Confidentiality of sensitive data is not goal of this project.
`jCrypto` implements weak table-based encryption without additional encoding and doesn’t protect AES key. The attacker can computer the key byte directly.

## Algorithms
- white-box AES128-CTR
- white-box HMAC-SHA256

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
