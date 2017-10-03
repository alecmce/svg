const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const livereload = require('gulp-livereload');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const webserver = require('gulp-webserver');
const karma = require('gulp-karma');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

gulp.task('static', () => {
  return gulp.src(['static/**/*.html','static/**/*/ttf'])
    .pipe(gulp.dest('bin'));
});

gulp.task('sass', () => {
  return gulp.src('static/**/default.scss')
    .pipe(rename('default.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('bin'));
});

gulp.task('increment-build', () => {
  return gulp.src('./src/get_version.ts', { base: './' })
    .pipe(replace(/BUILD = (.*);/, (_, $1) => `BUILD = ${parseInt($1) + 1};`))
    .pipe(gulp.dest('./'));
});

gulp.task('compile', () => {
  const config = {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {},
  };

  return browserify(config)
    .plugin(tsify)
    .transform('babelify', { presets: ['es2015'], extensions: ['.ts'] })
    .bundle()
    .on('error', handleError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('bin'))
    .pipe(livereload())
    .on('error', handleError);
});

gulp.task('serve', () => {
  return gulp.src('bin').pipe(webserver({
    fallback: 'index.html',
    host: 'localhost',
    livereload: true,
    open: true,
  }));
})

gulp.task('build', gulp.series('increment-build', 'compile'));
gulp.task('server', gulp.series(gulp.parallel('build', 'static', 'sass'), 'serve'));

gulp.task('watchHtml', () => gulp.watch('static/**/*.html', gulp.series('static')));
gulp.task('watchScss', () => gulp.watch('static/**/*.scss', gulp.series('sass')));
gulp.task('watchSource', () => gulp.watch(['src/**/*.ts', '!src/get_version.ts'], gulp.series('build')));
gulp.task('watchTests', () => gulp.watch(['test/**/*.ts'], gulp.series('build')));

gulp.task('watch', gulp.parallel('watchHtml', 'watchScss', 'watchSource', 'watchTests'));

gulp.task('default', gulp.series('server', 'watch'));

function handleError(error, file) {
  gutil.log(
    gutil.colors.red('Browserify compile error:'),
    error.message);
  this.emit('end');
}
