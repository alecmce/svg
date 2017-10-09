const wallabify = require('wallabify');
const wallabyPostprocessor = wallabify({});
const babelCore = require('babel-core');

module.exports = function () {
  return {
    files: [
      { pattern: 'src/**/*.ts', load: false },
      '!src/**/*_test.ts'
    ],

    tests: [
      { pattern: 'src/**/*_test.ts', load: false }
    ],

    env: {
      kind: 'chrome'
    },

    preprocessors: {
      '**/*.js': file => babelCore.transform(
        file.content,
        { sourceMap: true, presets: ['es2015'] })
    },

    postprocessor: wallabyPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};