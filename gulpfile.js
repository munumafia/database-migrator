let gulp = require('gulp');
let ts = require('gulp-typescript');
let mocha = require('gulp-mocha');

let tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('test', ['compile'], function () {
    gulp.src('dist/test/**/*.js')
        .pipe(mocha());
});

gulp.task('watch', ['compile', 'test'], function () {
    gulp.watch("**/*.ts", ['compile']);
});

gulp.task('default', ['compile', 'test']);