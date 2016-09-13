var webpackConf = require('./webpack.config.js');

webpackConf.module.preLoaders.push([
    {
        test: /\.js?$/,
        include: /src/,
        exclude: /(node_modules|bower_components|tests)/,
        loader: 'babel-istanbul',
        // query: {
        //     cacheDirectory: true,
        // },
    }
]);

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'tests/tests.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'tests/tests.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConf,

    webpackMiddleware: {
        noInfo: true // working?
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // coverage statistics
    coverageReporter: {
        reporters:[
            // {type: 'html', dir:'coverage/'},
            // { type: 'teamcity' },
            { type: 'text-summary' }
        ]
    }
  });
}
