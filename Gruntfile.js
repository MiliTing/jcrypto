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
        //unused: true,
        globals: {}
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'wbaes.js', 'tools/**/*.js', 'tasks/*.js']
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
    shell: {
      options: {
        stderr: true
      },
      target: {
        command: 'node src/wbaes-generator.js "2b7e151628aed2a6abf7158809cf4f3c" -e "hex" -o "wbaes.base.js"'
      }
    },
    rename: {
        wbaes: {
            'files': [
                { src: 'wbaes.base.js', dest: 'wbaes.obf.js' }
            ],
            options: {
                scope: ['Aes'],
                print: false,
                protect: ['encrypt', 'decrypt']
            }
        },
    }
  });

  // Load dependency tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-esmangle');

  // Default task.
  grunt.registerTask('default', [
    'jsvalidate',
    'shell',
    'jshint',
    'rename',
    'nodeunit']);
};
