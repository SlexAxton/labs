module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsroot: '_assets/js/',
    jsdest: 'assets/js/',
    cssroot: '_assets/css/',
    cssdest: 'assets/css/',
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= jsdest %><%= pkg.name %>-<%= buildstats.hash %>.min.js': ['<%= jsdest %><%= pkg.name %>-<%= buildstats.hash %>.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', '_assets/js/**/*.js', '!_assets/js/plugins.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      js: {
        files: ['<%= jshint.files %>'],
        options: {
          atBegin: true
        },
        tasks: ['jshint', 'webpack:dev']
      },
      css: {
        files: ['<%= cssroot %>/**/*.scss', '<%= cssroot %>/**/*.css'],
        options: {
          atBegin: true
        },
        tasks: ['sass:dev']
      },
      images: {
        files: ['_assets/images/**'],
        options: {
          atBegin: true
        },
        tasks: ['copy:images']
      }
    },
    webpack: {
      dev: {
        entry: "./_assets/js/index.js",
        output: {
          path: "<%= jsdest %>",
          filename: "<%= pkg.name %>.dev.js",
        },
        devtool: "#inline-source-map"
      },
      build: {
        entry: "./_assets/js/index.js",
        output: {
          path: "<%= jsdest %>",
          filename: "<%= pkg.name %>-[hash].js"
        },
        storeStatsTo: "buildstats"
      }
    },
    copy: {
      images: {
        files: [{
          expand: true,
          cwd: '_assets/images',
          src: ['**'],
          dest: 'assets/images'
        }]
      }
    },
    sass: {
      options: {
        imagePath: '/assets/images'
      },
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          '<%= cssdest %>main.dev.css': '<%= cssroot %>main.scss'
        }
      },
      build: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%= cssdest %>main.css': '<%= cssroot %>main.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['jshint', 'webpack:build', 'sass:build', 'copy:images', 'uglify']);
};
