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
    'jscomplexity-threshold': {
        all : {
          src : [
            'src/*.js',
            'test/*.js',
            '!test/fixtures/*.js',
          ],
          options : {
            quiet : false,         // display report (see screenshot), default false
            complexity : 100,      // default 100, lower is better
            maintainability : 20, // default 20, higher is better
            lineNumber : 4000      // default 4000, lower is better
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
      aes: {
        command: 'node src/wbaes-generator.js "2b7e151628aed2a6abf7158809cf4f3c" -e "hex" -o "wbaes.base.js"'
      },
      hmac: {
        command: 'node src/wbhmac-generator.js "4a656665" -e "hex" -o "wbhmac.base.js"'
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
    },
    listComplexity: {
        all: {
            src: ['src/*.js', 'test/*.js', 'tools/*.js'],
            exclude: ['!test/fixtures/*.js'],
            options: {
                verbose: false,
                length: 6
            }
        }
    },
    clean: {
      test: ['test/fixtures/*.js']
    }
  });

  // Load dependency tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-jscomplexity-threshold');
  grunt.loadNpmTasks('grunt-esmangle');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Default task.
  grunt.registerTask('default', [
    'jsvalidate',
    //'shell',
    'jshint',
    'rename',
    'jscomplexity-threshold',
    'listComplexity',
    'nodeunit',
    'clean'
  ]);
};