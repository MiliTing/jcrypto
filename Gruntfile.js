module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        jsvalidate: {
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: true
            },
            targetName: {files: {src: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']}}
        },
        eslint: {
            options: {configFile: '.eslintrc.js'},
            target: ['src/**/*.js', 'test/*.js']
        },
        mkdir: {
            all: {
                options: {
                    mode: '0700',
                    create: ['tmp']
                },
            },
        },
        nodeunit: {all: ['test/*.js']},
        clean: {all: ['tmp']}
    });

    // Load dependency tasks.
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Default task.
    grunt.registerTask('default', [
        'jsvalidate',
        'eslint',
        'mkdir',
        'nodeunit',
        'clean'
    ]);
};
