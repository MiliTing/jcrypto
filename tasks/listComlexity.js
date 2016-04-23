module.exports = function(grunt) {

    'use strict';

    var defaultOptions = {
            verbose: false,
            length: 10
        };

    var cr = require('complexity-report'),
        Table = require('cli-table'),
        fs = require('fs'),
        globalList = [];

    function parseOptions(options){
        if (typeof options !== 'object'){
            options = {};
        }
        options.verbose = options.verbose || defaultOptions.verbose;
        options.length = options.length || defaultOptions.length;
        return options;
    }    

    function listComplexity(filename, options){
        var list = [],
            code = fs.readFileSync(filename, 'utf-8'),
            length = options.length;
        cr.run(code).functions.forEach(function (entry) {
            list.push({ name: entry.name, value: entry.complexity.cyclomatic });
        });
        list.sort(function (x, y) {
            return y.value - x.value;
        });
        if (options.verbose) {
            console.log(filename + ':');
            console.log('Most cyclomatic-complex functions:');
        }
        list.slice(0, length).forEach(function (entry) {
            if (options.verbose) {
               console.log(' ', entry.name, entry.value);
            }
            globalList.push({complexity: entry.value, file: filename, function: entry.name});
        });
    }

    function compare(a,b) {
        if (a.complexity < b.complexity) {
            return -1;
        } else if (a.complexity > b.complexity) {
            return 1;
        } else {
            return 0;
        }
    }

    function listGlobalComplexity(){
        console.log('Most cyclomatic-complex functions in the project:');
        globalList = globalList.sort(compare).reverse().slice(0, 10);
        var table = new Table({
            head: ['File', 'Function', 'Comlexity'],
            colWidths: [40, 40, 15],
            style : {
                compact: true,
                head: ['white']
            }
        });

        globalList.forEach(function (entry) {
            table.push ([entry.file, entry.function, entry.complexity]);
        });
        console.log(table.toString());
    }

    grunt.registerMultiTask('listComplexity', 'List code complexity', function() {
        var options = parseOptions(this.data.options);
        var files = this.filesSrc || grunt.file.expandFiles(this.file.src),
            excludedFiles = this.data.exclude;   
        if (excludedFiles) {
            grunt.file.expand(excludedFiles).forEach(function (e) { files.splice(files.indexOf(e), 1); });
        }
        files.forEach(function(name){
            listComplexity(name, options);
        });
        listGlobalComplexity();
    });
};