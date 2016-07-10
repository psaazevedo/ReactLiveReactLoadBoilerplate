"use strict";

var gulp     = require("gulp"),
  gutil      = require("gulp-util"),
  nodemon    = require("gulp-nodemon"),
  source     = require("vinyl-source-stream"),
  buffer     = require("vinyl-buffer"),
  browserify = require("browserify"),
  watchify   = require("watchify"),
  babelify   = require("babelify"),
  envify     = require("envify"),
  lrload     = require("livereactload"),
  gulpif     = require('gulp-if'),
  less       = require('gulp-less'),
  minifyCSS  = require('gulp-minify-css'),
  uglify     = require('gulp-uglify'),
  concat     = require('gulp-concat'),
  connect    = require('gulp-connect');

var isProd = false,
    stylesDirectory = './app/assets/styles',
    cssFiles        = stylesDirectory + '/**/*.less',
    distDirectory   = "./app/dist";

function createBundler(useWatchify) {
  return browserify({
    entries:      './app/index.jsx',
    extensions:   ['.jsx'],
    transform:    [ [babelify, { compact: false }], [envify, {}] ],
    plugin:       isProd || !useWatchify ? [] : [ lrload ],    // no additional configuration is needed
    debug:        !isProd,
    cache:        {},
    packageCache: {},
    fullPaths:    !isProd                       // for watchify
  })
}

// Build CSS
gulp.task('build:css', function(){
    return gulp.src(cssFiles)
        .pipe(less())
        .pipe(gulpif(isProd, minifyCSS({keepBreaks:true})))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(distDirectory))
        .pipe(connect.reload());
});

gulp.task("bundle:js", function() {
  var bundler = createBundler(false)
  bundler
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(distDirectory))
})

// Build JS
gulp.task("watch:js", function() {
  // start JS file watching and rebundling with watchify
  var bundler = createBundler(true)
  var watcher = watchify(bundler, { debug: true })
  rebundle()
  return watcher
    .on("error", gutil.log)
    .on("update", rebundle)

  function rebundle() {
    gutil.log("Update JavaScript bundle")
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulpif(isProd, uglify()))
      .pipe(gulp.dest(distDirectory))
  }
})

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8080,
    debug: true
  });
});

gulp.task('watch:css', function () {
    gulp.watch(cssFiles, ['build:css']);
});

gulp.task("default", ["connect", "build:css", "watch:js", "watch:css"])