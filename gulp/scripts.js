'use strict';

var path = require('path');
var gulp = require('gulp');
var sort = require('sort-stream');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var tsProject = $.typescript.createProject({
  typescript: require('typescript'),  // for typescript 1.5
  target: 'es5',
  sortOutput: true,
  experimentalDecorators: true
});

var comparator = function(a, b){
  var score = function(seed){
    if (seed.path.match(/app\.module\.js$/)) return -1; // app.module.js は最初
    if (seed.path.match(/index\.js$/)) return 1;        // index.js は最後
    return 0;
  };
  return score(a) - score(b);
};

gulp.task('scripts', ['tsd:install'], function () {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.ts'))
      .pipe($.sourcemaps.init())
      .pipe($.tslint())
      .pipe($.tslint.report('prose', { emitError: false }))
      .pipe($.typescript(tsProject)).on('error', conf.errorHandler('TypeScript'))
      .pipe(sort(comparator))
      .pipe($.concat('app.js'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size())
});
