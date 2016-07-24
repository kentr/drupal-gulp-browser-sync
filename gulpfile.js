/**
 * Gulpfile for using browser-sync reload server with Drupal 8 development.
 *
 * @author Kent Richards
 */

var gulp = require('gulp');

// ========== CONFIG ==========
var webRoot = './web';
var siteDir = webRoot + '/sites/default';
var themeDir = webRoot + '/themes/mytheme';

var sassSrcDir = themeDir + '/assets/sass';
var sassDestDir = themeDir + '/css';

// Patterns that Sass should watch for reprocessing.
// Glob pattern documentation: https://github.com/isaacs/node-glob.
var sassWatchPatterns = [
  sassSrcDir + '/**.scss'
];

// Host:port that the backend server (Apache, Nginx..) is listening on.
var reloadBackend = 'localhost:8081';

// Port used for main web connection.
var reloadFrontendPort = 8080;

// Patterns that reload server should watch for changes.

// Note: Any stylesheet compiled by Sass shouldn't need to be watched here
// because they should be injected into the HTML automatically by the
// 'sass' task.
var reloadWatchPatterns = [
  themeDir + '/**/*.@(png|jpe?g|gif|ico|svg|tiff)'
];

// Patterns for files that require a <code>drush cr</code> when changed.
var crWatchPatterns = [
  siteDir + '/**/*.yml',
  themeDir + '/**/*.yml',
  themeDir + '/**/*.theme',
  themeDir + '/templates/**/*.*'
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
  gulp.watch(sassWatchPatterns, ['sass']);
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

// ========== DRUSH CACHE RESET ==========
var run = require('gulp-run');

gulp.task('cr', function() {
  var cmd = 'drush cr';
  return run(cmd, { cwd: webRoot }).exec();
});


// ========== MAIN WATCH ==========
gulp.task('watch', ['browser-sync', 'sass:watch'], function () {
    gulp.watch(reloadWatchPatterns, reload);
    gulp.watch(crWatchPatterns, ['cr', reload]);
});
