module.exports = function (config) {
  config.set({
    autoWatch: true,
    browserify: { debug: true, plugin: [['tsify', { target: 'es6' }]] },
    browsers: ['Chrome'],
    colors: true,
    concurrency: Infinity,
    exclude: [
      'src/main.ts',
    ],
    files: [
      'src/**/*.ts',
      'test/**/*.ts',
    ],
    frameworks: ['browserify', 'jasmine'],
    karmaTypescriptConfig: { tsconfig: "./tsconfig.json" },
    logLevel: 'INFO',
    mime: { 'text/x-typescript': ['ts'] },
    port: 9876,
    preprocessors:
    { 'src/**/*.ts': ['browserify'], 'test/**/*.ts': ['browserify'] },
    reporters: ['karma-typescript', 'progress'],
    singleRun: false,
  })
}
