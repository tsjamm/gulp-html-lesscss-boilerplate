var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new lessPluginAutoprefix({ browsers: ['last 2 versions'] });
var path = require('path');
var babel = require('gulp-babel');
var lessToScss = require('gulp-less-to-scss');

var paths = {
    base: './',
    src: './src/',
    build: './build/'
};

gulp.task('processHTML', function() {
    gulp.src(path.join(paths.src, '*.html'))
        .pipe(gulp.dest(path.join(paths.build)));
});

gulp.task('processAssets', function() {
    gulp.src(path.join(paths.src, '/assets/**/*'))
        .pipe(gulp.dest(path.join(paths.build, 'assets')));
    /// this is just for order form validation to work.
    gulp.src(path.join(paths.src, '/cart/**/*'))
        .pipe(gulp.dest(path.join(paths.build, 'cart')));
    gulp.src(path.join(paths.src, '/styles/**/*.less'))
        .pipe(gulp.dest(path.join(paths.build, 'styles')));
});

gulp.task('processJS', function() {
    gulp.src(path.join(paths.src, 'scripts/*.js'))
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['latest'] }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(paths.build, 'scripts')));
});

gulp.task('processLESS', function() {
    gulp.src(path.join(paths.src, 'styles/*.less'))
        .pipe(sourcemaps.init())
        .pipe(less({ strictMath: 'on' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(paths.build, 'styles')));
});

gulp.task('lessToScss', function() {
    gulp.src(path.join(paths.src, 'styles/**/*.less'))
        .pipe(lessToScss())
        .pipe(gulp.dest(path.join(paths.build, 'styles')));
});

gulp.task('build', ['lessToScss', 'processLESS', 'processJS', 'processAssets', 'processHTML']);

gulp.task('default', ['serve']);

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: paths.build,
        port: 3000
    });

    gulp.watch(path.join(paths.src, 'styles/**/*.less'), ['lessToScss', 'processLESS']).on('change', function(file) { browserSync.reload }); //server.notify.apply(server, [file])});
    gulp.watch(path.join(paths.src, 'scripts/**/*.js'), ['processJS']).on('change', function(file) { browserSync.reload }); //server.notify.apply(server, [file])});
    gulp.watch(path.join(paths.src, '*.html'), ['processHTML']).on('change', function(file) { browserSync.reload }); //server.notify.apply(server, [file])});
    gulp.watch(path.join(paths.src, 'assets/**/*'), ['processAssets']).on('change', function(file) { browserSync.reload }); //server.notify.apply(server, [file])});
});