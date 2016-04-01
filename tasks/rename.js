module.exports = function(grunt) {
    'use strict';

    var esprima = require('esprima'),
        escodegen = require('escodegen'),
        renameProperties = require('../tools/rename-properties.js'),
        code = '', tree, result = '';

    grunt.registerMultiTask('rename', 'Object properties renamer', function() {
        var data =  this.data;
        this.files.forEach(function(file) {
            code = file.src.filter(function(filePath) {
                    // Warn on and remove invalid source files.
                    if (!grunt.file.exists(filePath)) {
                        grunt.log.warn('Source file `' + filePath + '` not found.');
                        return false;
                    } else {
                        return true;
                    }
            }).map(function(filePath) {
                // Read file source.
                return grunt.file.read(filePath);
            }).join(';');
            tree = esprima.parse(code, {loc: true});
            renameProperties(tree, data.options);
            result = escodegen.generate(tree);
            grunt.file.write(file.dest, result);
        });
    });
};