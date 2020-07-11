var gulp = require('gulp'),
    plumberNotifier = require('gulp-plumber-notifier'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    concatCss = require('gulp-concat-css'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence').use(gulp),
    uglify = require('gulp-uglifyes'),
    concat = require('gulp-concat'),
    gulpSequence = require('gulp-sequence')


gulp.task('compile', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css/'))
});


gulp.task('bundle', function () {
    return gulp.src([

        'src/css/normalize.min.css',
        'src/css/styles.css'
    ])
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('dist/'));
});

gulp.task('nano', function () {
    return gulp.src('dist/bundle.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('autoprefix', function () {
    return gulp.src('dist/bundle.css')
        /*	return gulp.src([
         'css/normalize.min.css',
         ])*/
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
    return gulp.src([
        'src/js/jquery.js',
        'src/js/scripts.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('minjs', function () {
    return gulp.src([
        'dist/bundle.js'
    ])
        .pipe(plumberNotifier())
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: false,
            ecma: 6
        }))
        .pipe(rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', () => {
    //Следить за файлами со стилями с нужным расширением
    gulp.watch('src/scss/**/*.scss', gulp.series('default'))
    //Следить за JS файлами
    gulp.watch('src/js/**/*.js', gulp.series('scripts', 'minjs'));
    //При изменении HTML запустить синхронизацию
    // gulp.watch("./*.html").on('change', browserSync.reload);
});


gulp.task('dist', function (callback) {
    gulpSequence('compile', 'bundle', 'nano', 'autoprefix','minjs', 'scripts' , callback);
});

gulp.task('dev', function (callback) {
    gulp.series( gulp.parallel('compile', 'bundle'), gulp.parallel('nano', 'autoprefix') );
})
gulp.task('default', gulp.series('compile', gulp.series('bundle', 'nano'), 'autoprefix'));