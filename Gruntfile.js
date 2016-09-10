module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    watch: {
        files: '<%= jshint.all %>',
        tasks: 'default'
    },
    jshint: {
        options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            eqnull: true,
            node: true,
            devel: true,
            browser: true,
            noempty: true,
            unused: true,
            quotmark: 'single',
            strict: true,
            globals: {}
      },
        all: ['Gruntfile.js', 'src/**/*.js', '!src/index.js', 'test/*.js']
    },
    jsvalidate: {
        options:{
            globals: {},
            esprimaOptions: {},
            verbose: false
        },
        targetName:{
            files:{
                src:['<%=jshint.all%>']
            }
        }
    },
    nodeunit: {
      all: ['test/*.js']
    },
    clean: {
      test: ['test/fixtures/*.js']
    }
  });

  // Load dependency tasks.
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Default task.
  grunt.registerTask('default', [
    'jsvalidate',
    'jshint',
    'nodeunit',
    'clean'
  ]);
};