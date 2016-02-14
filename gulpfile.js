var gulp = require('gulp'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
cssNano = require('gulp-cssnano'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync'),
merge = require('merge-stream');

var config = {
  sassPath: './assets/sass/',
  jsPath: './assets/scripts/',
  publicPath: './public/',
  npmDir: './node_modules/',
}

gulp.slurped = false;

gulp.task('copy', function() {
  var basscss = gulp.src(config.npmDir + 'basscss-sass/scss/*')
  .pipe(gulp.dest(config.sassPath + 'vendor/basscss-sass/'));

  var jquery = gulp.src(config.npmDir + 'jquery/dist/jquery.min.js')
  .pipe(gulp.dest(config.publicPath + 'scripts/'));

  var matchHeight = gulp.src(config.npmDir + 'jquery-match-height/dist/jquery.matchHeight-min.js')
  .pipe(gulp.dest(config.jsPath + 'vendor/'));

  return merge(
    basscss,
    jquery,
    matchHeight
  );
});

gulp.task('build-css', function() {
  return gulp.src([
    config.sassPath + 'app.scss',
  ])
  .pipe(sass().on('error', function(e){
    console.log(e);
  }))
  .pipe(autoprefixer({
    browers: [
      'last 2 version',
      'IE 8',
    ]
  }))
  .pipe(cssNano())
  .pipe(concat('all.min.css'))
  .pipe(gulp.dest(config.publicPath + 'css/'))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

gulp.task('build-js', function() {
  return gulp.src([
    config.jsPath + 'main.js',
  ])
  .pipe(uglify())
  .pipe(concat('all.min.js'))
  .pipe(gulp.dest(config.publicPath + 'scripts/'))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

gulp.task('watch', function() {
  if(!gulp.slurped) {
    gulp.watch("gulpfile.js", ["default"]);
    gulp.watch(config.jsPath + '*.js', ['build-js']);
    gulp.watch(config.sassPath + '**/*.scss', ['build-css']);
    gulp.watch(config.publicPath + "*.html", browserSync.reload);
    browserSync.init({
      injectChanges: true,
      server: "./public",
      open: false,
      domain: 'http://localhost:3000',
    });
    gulp.slurped = true;
  }
});

gulp.task('build', ['copy', 'build-css', 'build-js']);
gulp.task('default', ['watch']);
