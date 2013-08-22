/* jshint node: true */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    transpile: {
      main: {
        type: 'amd',
        moduleName: function(path) {
          return grunt.config.process('momentum/') + path;
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'tmp/transpiled/'
        }]
      }
    },
    concat_sourcemap: {
      main: {
        src: 'tmp/transpiled/**/*.js',
        dest: 'tmp/game.js',
        options: {
          sourceRoot: ".."
        }
      }
    },
    watch: {
      main: {
        files: ["src/**/*.js"],
        tasks: ["default"]
      }
    },
    connect: {
      server: {
        options: {
          port: process.env.PORT || 8000,
          hostname: '0.0.0.0',
          base: '.'
        }
      }
    }
  });

  grunt.registerTask("default", ["transpile", "concat_sourcemap"]);
  grunt.registerTask("dev", ["default", "connect", "watch"]);
};
