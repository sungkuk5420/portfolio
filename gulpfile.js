var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var stripDebug = require('gulp-strip-debug');
var order = require("gulp-order");
const imagemin = require('gulp-imagemin');


var src = 'public';
var dist = 'public/dist';

var paths = {
    // js: src + '/javascripts/**/*.js',
    js: src + '/javascripts/*/*.js',
    css: src + '/stylesheets/*/*.css',
    image: src + '/images/*/*.{jpg,png}',
    scss: src + '/scss/*/*.scss'
};

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// ウェブサーバーを localhost:3000 で実行する
gulp.task('browser-sync', function () {
    browserSync.init({
        files: ['public/**/*.*', 'views/**/*.*'], // BrowserSyncにまかせるファイル群
        proxy: 'http://localhost:3000', // express の動作するポートにプロキシ
        port: 4000, // BrowserSync は 4000 番ポートで起動
        open: true // ブラウザ open する
    });
});

//nodeファイルの変更するとサーバーを自動更新
gulp.task('server', gulp.series(gulp.parallel('browser-sync')), function () {
    nodemon({
        script: './app.js',
        ext: 'js css',
        ignore: [ // nodemon で監視しないディレクトリ
            'node_modules',
            'bin',
            'views',
            'public'
        ],
        env: {
            'NODE_ENV': 'development'
        },
        stdout: false // Express の再起動時のログを監視するため
    }).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if (/^Express\ server\ listening/.test(chunk)) {
                // Express の再起動が完了したら、reload() でBrowserSync に通知。
                // ※Express で出力する起動時のメッセージに合わせて比較文字列は修正
                browserSync.reload({
                    stream: false
                });
            }
            process.stdout.write(chunk);
        });
        this.stderr.on('data', function (chunk) {
            process.stderr.write(chunk);
        });
    });
});

//　Javascriptファイルを一つに併合
gulp.task('combine-js', function () {
    console.log(paths.js)
    return gulp.src([
            'public/javascripts/core/jquery-1.12.4.js',
            'public/javascripts/core/bootstrap.min.js',
            'public/javascripts/core/jquery.isotope.min.js',
            'public/javascripts/core/jquery.placeholder.min.js',
            'public/javascripts/core/contact_me.js',
            'public/javascripts/core/smooth-scroll.js',
            'public/javascripts/core/iscroll.js',
            // 'public/javascripts/core/firebase-4.3.0.js',
            // 'public/firebaseKey.js',
            'public/javascripts/userScript.js'
        ])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(dist + '/js'));
});

// sass ファイルを css にこんコンパイルする.
gulp.task('compile-sass', function () {
    return gulp.src([paths.scss, paths.css, 'public/stylesheets/*.css'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe(csso())
        .pipe(concat('stylesheet.css'))
        .pipe(gulp.dest(dist + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// image ファイルを compression する.
gulp.task('compile-images', function () {
    return gulp.src([paths.image, 'public/images/*.{jpg,png}'])
        .pipe(imagemin())
        .pipe(gulp.dest(dist + '/images'))
});

// ファイルの変更感知とブラウザの再起動
gulp.task('watch', function () {
    gulp.watch(paths.js, gulp.task('combine-js'));
    gulp.watch(paths.scss, gulp.task('compile-sass')).on('change', browserSync.reload);
    gulp.watch(dist + '/**');
});

//基本taskの設定
gulp.task('default', gulp.series(gulp.parallel(
    'combine-js', 'server',
    'compile-sass', 'compile-images',
    'watch')));