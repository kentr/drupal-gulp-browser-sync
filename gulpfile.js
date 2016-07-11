/**
 * Gulpfile for using browser-sync reload server with Drupal development.
 *
 * @author Kent Richards
 */

var gulp = require('gulp');

// ========== CONFIG ==========
var webRoot = './www';
var themeDir = webRoot + '/sites/all/themes/mytheme';

var sassSrcDir = themeDir + '/assets/sass';
var sassDestDir = themeDir + '/css';

// TCP host:port that the backend server (Apache, Nginx..) is listening on.
var reloadBackend = '127.0.0.1:8081';

// TCP port used for main web connection.
var reloadFrontendPort = 8080;

// Globs that reload server should watch for changes.
// @see https://github.com/isaacs/node-glob.
var reloadWatchGlobs = [

  ];

// Globs for files that require a <code>drush cr</code> when changed.
var crWatchGlobs = [
  themeDir + '/**/*.yml',
  themeDir + '/**/*.theme'
];





// ========== SASS ==========

var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src(sassSrcDir + '/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(sassDestDir))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', ['sass'], function () {
  gulp.watch(sassSrcDir + '/**.scss', ['sass']);
});

// ========== BROWSER-SYNC / RELOAD ==========

var browserSync = require('browser-sync');
var reload  = browserSync.reload;

gulp.task('browser-sync', function() {
    browserSync({
        proxy: reloadBackend,
        port: reloadFrontendPort,
        open: true,
        notify: false
    });
});


var run = require('gulp-run');

gulp.task('cr', function() {
  var cmd = 'drush cr';
  return run(cmd, { cwd: webRoot }).exec();
});


// ========== DEFAULT ==========

gulp.task('default', ['browser-sync', 'sass:watch'], function () {
    gulp.watch(reloadWatchGlobs, [reload]);
    gulp.watch(crWatchGlobs, ['cr', reload]);
});
