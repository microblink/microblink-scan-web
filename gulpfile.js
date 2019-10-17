var gulp = require('gulp');
var replace = require('gulp-replace');

// https://github.com/angular/angular/issues/21191
// This gulp task enables the progress event for AJAX requests to propagate to our code instead of getting caught in Angular service worker handling code. 

gulp.task('swAjaxUploadFix', done => {
  gulp.src(['dist/apps/public/scan-client/ngsw-worker.js'])
    .pipe(replace("onFetch(event) {", "onFetch(event) { if (event.request.url.indexOf('/recognize/execute') !== -1) { return; }"))
    .pipe(gulp.dest('dist/apps/public/scan-client/'));
    done();
});