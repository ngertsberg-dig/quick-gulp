'use strict';


const sassPath = "./styles";
const JSPath = "./js";


var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
sass.compiler = require('node-sass');
 gulp.task('browser-sync', function() {
        browserSync.init({
        proxy: "localhost",
        watchTask: true,
        notify: false,
        scrollProportionally: false
    });
});
gulp.task('sass', function () {
  return gulp.src(`${sassPath}/*.sass`)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(`${sassPath}/compiled`))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('watch',function(){
    gulp.watch(`${sassPath}/*.sass`,{ usePolling: true }, gulp.series('sass'));
    gulp.watch(`${sassPath}/*.sass`,{ usePolling: true },browserSync.reload);
})

gulp.task('minify', function () {
  gulp.src(`${sassPath}/compiled/main.css`)
    .pipe(uglifycss({
      "maxLineLen": 1,
      "uglyComments": true
    }))
    .pipe(gulp.dest(`${sassPath}/compiled/minified/`));
    
});

gulp.task('babel', () =>
    gulp.src(`${JSPath}/*.js`)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(`${JSPath}/compiled/`))
);
gulp.task('concatBabel', () =>
    gulp.src(`${JSPath}/compiled/*.js`)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(`${JSPath}/compiled/concat/`))
);
gulp.task('watchBabel',function(){
    gulp.watch(`${JSPath}/*.js`,{ usePolling: true }, gulp.series('babel','concatBabel'));

})

gulp.task('watchBabel', gulp.series('watchBabel'));

gulp.task('watchAll', gulp.parallel('browser-sync','watch','watchBabel'));
gulp.task('min', gulp.series('minify'));