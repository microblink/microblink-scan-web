var gulp = require('gulp');
var replace = require('gulp-replace');
 
gulp.task('swAjaxUploadFix', done => {
  gulp.src(['dist/apps/public/scan-client/ngsw-worker.js'])
    .pipe(replace("onFetch(event) {", "onFetch(event) { if (event.request.url.indexOf('/recognize/execute') !== -1) { return; }"))
    .pipe(gulp.dest('dist/apps/public/scan-client/'));
    done();
});