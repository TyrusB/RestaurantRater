module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        css: {
          src: [
            'public/stylesheets/*.css'
          ],
          dest: 'public/dist/app.css'
        },
        js : {
            src : [
                'public/javascripts/*.js'
            ],
            dest : 'public/dist/app.js'
        },
        vendor: {
          src: [
            'public/javascripts/vendor/jquery.min.js',
            'public/javascripts/vendor/*.js'
          ],
          dest: 'public/dist/vendor.js'
        }
      },

      cssmin : {
          css:{
              src: 'public/dist/app.css',
              dest: 'public/dist/app.min.css'
          }
      },

      uglify : {
          js: {
              files: {
                  'public/dist/app.js' : [ 'public/dist/app.js' ]
              }
          }
      },

      watch: {
        myJs: {
          files: ['public/javascripts/*.js'],
          tasks: ['concat:js', 'uglify:js']
        },
        myCss: {
          files: ['public/stylesheets/*.css'],
          tasks: ['concat:css', 'cssmin:css']
        },
        vendor: {
          files: ['public/javascripts/vendor/*.js'],
          tasks: ['concat:vendor']
        }
       
      }
    });

    

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', [ 'concat:css', 'cssmin:css', 'concat:js', 'uglify:js', 'concat:vendor' ]);
};