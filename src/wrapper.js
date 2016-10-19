'use strict';

var esformatter = require('esformatter');

var options = {indent: {value: '    '}},
    wrapper = {};

var code;

// UMD (Universal Module Definition)
wrapper.umd = function(funcString, windowObject, returnValue) {
    code =
    '(function (root, factory) {\n' +
    '   if (typeof define === \'function\' && define.amd) {\n' +
    '        define([], factory);\n' +
    '   } else if (typeof module === \'object\' && module.exports) {\n' +
    '       module.exports = factory();\n' +
    '   } else {\n' +
    '      root.' + windowObject + ' = factory();\n' +
    '   }\n' +
    '}(this, function () {\n' +
    '    \'use strict\';\n' +
    funcString + '\n' +
    'return ' + returnValue + ';\n}));\n';

    return esformatter.format(code, options);
};

wrapper.iife = function(funcString, returnValue) {
    code =
    '(function () {\n' +
    '    \'use strict\';\n' +
    funcString + '\n' +
    'module.exports = ' + returnValue + ';\n' +
    '}());\n';

    return esformatter.format(code, options);
};

wrapper.switch = function(code, options) {
    switch(options.wrapper) {
        case 'UMD':
            return wrapper.umd(code, options.windowObject, options.returnValue);
        case 'IIFE':
            return wrapper.iife(code, options.returnValue);
        default:
            return code;
    }
};
module.exports = wrapper.switch;
