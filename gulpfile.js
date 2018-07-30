// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 检查脚本
gulp.task('lint', function() {
    gulp.src('app/*/*.js') //该任务针对的文件
        .pipe(jshint())  //该任务调用的模块
        .pipe(jshint.reporter('default'));
});

// 编译less
gulp.task('less', function() {
    gulp.src('app/*/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist'));
});

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src('app/*/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// 默认任务
gulp.task('default', function(){
    gulp.run('lint', 'less', 'scripts');

    // 监听js文件变化
    gulp.watch('app/*/*.js', function(){
        gulp.run('lint', 'less', 'scripts');
    });
    // 监听less文件变化
    gulp.watch('app/*/*.less', function(){
        gulp.run('lint', 'less', 'scripts');
    });
});