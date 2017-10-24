let gulp = require('gulp');
let ts = require('gulp-typescript');

let tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function () {
    gulp.watch("**/*.ts", ['compile']);
});

gulp.task('default', ['compile']);