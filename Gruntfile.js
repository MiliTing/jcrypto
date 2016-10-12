module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        jsvalidate: {
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: true
            },
            targetName: {
                files: {src: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']}
            }
        },
        eslint: {
            options: {
                config: '.eslintc.js',
                reset: true
            },
            target: ['src/**/*.js', 'test/*.js']
        },
        nodeunit: {all: ['test/*.js']},
        clean: {test: ['test/fixtures/*.js']}
    });

    // Load dependency tasks.
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Default task.
    grunt.registerTask('default', [
        'jsvalidate',
        'eslint',
        'nodeunit',
        'clean'
    ]);
};
