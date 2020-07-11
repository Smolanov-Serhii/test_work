var gulp = require('gulp'),
    plumberNotifier = require('gulp-plumber-notifier'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    concatCss = require('gulp-concat-css'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence').use(gulp),
    // uglify = require('gulp-uglify'),
    // plumber = require('gulp-plumber');
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
        'src/css/horizontal.css',
        // 'src/css/perfect-scrollbar.css',
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
         'css/main.css',
         'css/grids/flexboxgrid.css',
         'css/slick.css',
         'css/selectric.css',
         'css/jquery-ui.min.css',
         'css/fonts.css',
         'css/reset.css',
         'css/common.css',
         'css/style.css',
         'css/desktop.css',
         'css/tablet.css',
         'css/mobile.css'
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
        'src/js/slick.js',
        'src/js/sly.min.js',
        // 'src/js/perfect-scrollbar.js',
        // 'src/js/wow.js',
        // 'src/js/masonry.pkgd.min.js',
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
    // browserSync.init({
    //    server: {
    //       baseDir: "./"
    //    }
    // });
    //Следить за файлами со стилями с нужным расширением
    gulp.watch('src/scss/**/*.scss', gulp.series('default'))
    //Следить за JS файлами
    gulp.watch('src/js/**/*.js', gulp.series('scripts', 'minjs'));
    //При изменении HTML запустить синхронизацию
    // gulp.watch("./*.html").on('change', browserSync.reload);
});

// gulp.task('watch', function () {
//     gulp.watch('sass/**/*.scss',
//         function (event) {
//             gulpSequence('compile')(function (err) {
//                 if (err) console.log(err)
//             })
//         })
// });

// gulp.task('dist', ['compile', 'bundle', 'nano', 'autoprefix']);


gulp.task('dist', function (callback) {
    gulpSequence('compile', 'bundle', 'nano', 'autoprefix','minjs', 'scripts' , callback);
});

gulp.task('dev', function (callback) {
    gulp.series( gulp.parallel('compile', 'bundle'), gulp.parallel('nano', 'autoprefix') );
})
gulp.task('default', gulp.series('compile', gulp.series('bundle', 'nano'), 'autoprefix'));