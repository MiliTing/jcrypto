module.exports = function(grunt) {
    'use strict';

    var defaultOptions = {
            verbose: false,
            length: 10,
            difficulty: true,
            cyclomatic: true
        };

    var cr = require('complexity-report'),
        Table = require('cli-table'),
        fs = require('fs'),
        globalComplexityList = [],
        globalDifficultyList = [];

    function parseOptions(options){
        if (typeof options !== 'object'){
            options = {};
        }
        options.verbose = options.verbose || defaultOptions.verbose;
        options.length = options.length || defaultOptions.length;
        options.difficulty = options.difficulty || defaultOptions.difficulty;
        options.cyclomatic = options.cyclomatic || defaultOptions.cyclomatic;
        return options;
    }    

    function listComplexity(filename, options){
        var clist = [], dlist =[],
            code = fs.readFileSync(filename, 'utf-8'),
            length = options.length;
        cr.run(code).functions.forEach(function (entry) {
            clist.push({ name: entry.name, value: entry.complexity.cyclomatic });
            dlist.push({ name: entry.name, value: entry.complexity.halstead.difficulty });
        });
        clist.sort(function (x, y) {
            return y.value - x.value;
        });
        dlist.sort(function (x, y) {
            return y.value - x.value;
        });
        if (options.verbose && options.cyclomatic) {
            console.log(filename + ':');
            console.log('Most cyclomatic-complex functions:');
        }
        clist.slice(0, length).forEach(function (entry) {
            if (options.verbose && options.cyclomatic) {
               console.log(' ', entry.name, entry.value);
            }
            globalComplexityList.push({value: entry.value, file: filename, function: entry.name});
        });
        if (options.verbose && options.difficulty) {
            console.log(filename + ':');
            console.log('Most Halstead-difficulty functions:');
        }
        dlist.slice(0, length).forEach(function (entry) {
            if (options.verbose && options.difficulty) {
               console.log(' ', entry.name, entry.value);
            }
            globalDifficultyList.push({value: entry.value, file: filename, function: entry.name});
        });
    }

    function listGlobalComplexity(options){
        if (!options.cyclomatic){
            return;
        }
        console.log('Most cyclomatic-complex functions in the project:');
        globalComplexityList.sort(function (x, y){
            return y.value - x.value;
        });
        var table = new Table({
            head: ['File', 'Function', 'Cyclomatic complexity'],
            colWidths: [40, 40, 25],
            style : {
                compact: true,
                head: ['white']
            }
        });
        globalComplexityList.slice(0, options.length).forEach(function (entry) {
            table.push ([entry.file, entry.function, entry.value]);
        });
        console.log(table.toString());
    }

    function listGlobalDifficulty(options){
        if (!options.difficulty){
            return;
        }
        console.log('Most Halstead-difficulty functions in the project:');
        globalDifficultyList.sort(function (x, y){
            return y.value - x.value;
        });
        var table = new Table({
            head: ['File', 'Function', 'Halstead difficulty'],
            colWidths: [40, 40, 25],
            style : {
                compact: true,
                head: ['white']
            }
        });
        globalDifficultyList.slice(0, options.length).forEach(function (entry) {
            table.push ([entry.file, entry.function, entry.value]);
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
        listGlobalComplexity(options);
        listGlobalDifficulty(options);
    });
};