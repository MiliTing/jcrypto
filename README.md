# jCrypto

These are an experimental white-box cryptography tools for JavaScript obfuscation.

## Algorithms
- white-box AES128-CTR
- white-box HMAC-SHA256

## Installation
```
npm install jcrypto
```
or
```
git clone https://github.com/tsu-iscd/jcrypto.git
cd jcrypto
npm install
```

## API

Code generation:
```
var key = "1234567891234567";
var generateAes = require('jcrypto');
var fs = require('fs');
var file = 'aes.js';

var code = generateAes(key, {encoding: 'hex'});
fs.writeFileSync(file, code);
```

Encryption:
```
var aes = require('aes');
var input = "Hello, world!";
var ciphertext = aes.encrypt(plaintext);
var output = aes.decrypt(ciphertext);
// Hello, world!
```

## Command line interface

The `bin/jcrypto` utility can be used to generate code of white-box crypto algorithm. It accepts as arguments its secret key, output file and the following options:

* `-a, --algorithm` -  crypto algorithms: aes, hmac.
* `-h, --help` -  display help.
* `-k, --key` - secret key.
* `-e, --encoding` - key characters encoding; posible values: hex.
* `-o, --output` - output file.

Example:

```
$ bin/jcrypto -a aes -k 1234567891234567 -o wbaes.js
```


## Contributors
- Denis Kolegov
- Oleg Broslavsky
- Nikita Oleksov

## References
1. [En] [Oleg Broslavsky, Denis Kolegov, Nikita Oleksov. White-Box HMAC.] (http://www.slideshare.net/yalegko/whitebox-hmac-make-your-cipher-secure-to-whitebox-attacks)
2. [Ru] [Oleg Broslavsky, Denis Kolegov, Nikita Oleksov. HMAC Obfuscation Method for Implementation in Untrusted Systems. ](http://www.mathnet.ru/links/31303c3ca85d02fecff4f980a844ddc1/pdma275.pdf)
