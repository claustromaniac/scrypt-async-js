module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      unittests: {
        files: {
          'test/lib/unittests-bundle.js': [ './test/unittests.js' ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: './test'
        }
      }
    },
    copy: {
      test: {
        expand: true,
        flatten: true,
        cwd: 'node_modules/',
        src: ['mocha/mocha.css', 'mocha/mocha.js'],
        dest: 'test/lib/'
      }
    },
    mocha_istanbul: {
      coveralls: {
        src: ['test'],
        options: {
          coverage:true,
          timeout: 6000,
          reportFormats: ['cobertura','lcovonly']
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          username: process.env.SAUCE_USERNAME,
          key: function() { return process.env.SAUCE_ACCESS_KEY; },
          urls: ['http://127.0.0.1:3000/unittests.html'],
          build: process.env.TRAVIS_JOB_ID,
          testname: 'Sauce Unit Test for scrypt-async-js',
          browsers: [
            {
              browserName: "safari",
              platform: "OS X 10.10"
            },
            {
              browserName: "chrome",
              platform: "OS X 10.10",
              version: "48"
            },
            {
              browserName: "firefox",
              platform: "OS X 10.10",
              version: "44"
            },
            {
              browserName: "microsoftedge",
              version: "13.10586",
              platform: "Windows 10"
            },
            {
              browserName: "internet explorer",
              version: "11",
              platform: "Windows 8.1"
            },
            {
              browserName: "internet explorer",
              version: "10",
              platform: "Windows 8"
            },
            {
              browserName: "internet explorer",
              version: "9",
              platform: "Windows 7"
            },
            {
              browserName: "internet explorer",
              version: "8",
              platform: "Windows 7"
            },
            {
              browserName: "chrome",
              platform: "Windows 8.1",
              version: "beta"
            },
            {
              browserName: "firefox",
              platform: "Windows 8.1",
              version: "beta"
            },
            {
              browserName: "iphone",
              platform: "OS X 10.10",
              version: "8.2"
            },
            {
              browserName: "chrome",
              platform: "Linux",
              version: "37"
            },
            {
              browserName: "firefox",
              platform: "Linux",
              version: "34"
            },
            {
              browserName: "android",
              platform: "Linux",
              version: "5.1"
            },
            {
              browserName: "android",
              platform: "Linux",
              version: "4.4"
            },
            {
              browserName: "iphone",
              platform: "OS X 10.10",
              version: "7.1"
            },
            {
              browserName: "iphone",
              platform: "OS X 10.10",
              version: "9.2"
            }
          ],
          public: "public",
          maxRetries: 3,
          throttled: 2,
          pollInterval: 4000,
          statusCheckAttempts: 200
        }
      },
    },
    uglify: {
      scrypt: {
        options: {
          ie8: true,
          preserveComments: function(node, comment) {
            return comment && comment.value && comment.value.length &&
                   comment.value[0] === "!";
          }
        },
        files: {
          'scrypt-async.min.js' : [ 'scrypt-async.js' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-istanbul')
  grunt.loadNpmTasks('grunt-saucelabs');

  grunt.event.on('coverage', function(lcov, done){
      require('coveralls').handleInput(lcov, function(err){
          if (err) {
              return done(err);
          }
          done();
      });
  });

  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('test', ['browserify', 'copy:test', 'mocha_istanbul']);
  grunt.registerTask('test_and_coveralls', ['browserify', 'copy:test', 'mocha_istanbul:coveralls']);
  grunt.registerTask('saucelabs', ['connect', 'saucelabs-mocha']);
};
