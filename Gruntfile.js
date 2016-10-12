module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        watch: {
            files: '<%= jshint.all %>',
            tasks: 'default'
        },
        eslint: {
            options: {
                config: '.eslintc.js',
                reset: true
            },
            target: ['src/**/*.js']
        },
        nodeunit: {all: ['test/*.js']},
        clean: {test: ['test/fixtures/*.js']}
    });

    // Load dependency tasks.
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    // Default task.
    grunt.registerTask('default', [
        'nodeunit',
        'eslint',
        'clean'
    ]);
};
