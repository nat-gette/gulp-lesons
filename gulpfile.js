const { task, src, dest, watch, series } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();


task('html', () => {
  return src('src/**.html')
  .pipe(gulpif(argv.prod, htmlmin({ collapseWhitespace: true })))
  .pipe(dest('build'))
})

task('scss', () => {
  return src('src/style/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 version']
    }))
    .pipe(gulpif(argv.prod, csso()))
    .pipe(gulpif(argv.prod, rename({suffix: '.min'})))
    .pipe(sourcemaps.write())
    .pipe(dest('build/style'))
    .pipe(browserSync.stream());
})

task('watch', () => {
  watch('src/**.html', series('html').on('change', browserSync.reload));
  watch('src/style/**/*.scss', series('scss')).on('change', browserSync.reload);
});

task('clean', () => {
  return del('build')
});

task('browser-sync', function() {
  browserSync.init({
      server: 'build'
  });
});

task('default', series('clean', parallel('html', 'scss'), parallel('watch', 'browser-sync')));