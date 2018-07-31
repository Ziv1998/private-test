// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var spriter = require('gulp-css-spriter');
var cssmin = require('gulp-minify-css');
var fileinclude = require('gulp-file-include');
var imageMin = require('gulp-imagemin');

// 检查脚本
gulp.task('lint', function() {
	gulp.src('app/*/*.js') //该任务针对的文件
		.pipe(jshint()) //该任务调用的模块
		.pipe(jshint.reporter('default'));
});

// 编译less
gulp.task('less', function() {
	gulp.src('app/*/*.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'], //last 2 versions- 主流浏览器的最新两个版本
			cascade: true, //是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
			//        transform: rotate(45deg);
			remove: true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(concat('index.css')) //合并css
		.pipe(cssmin()) //压缩css
		.pipe(rename({
			suffix: '.min'
		})) //设置压缩文件名
		.pipe(gulp.dest('dist'));
});

// 合并，压缩文件
gulp.task('scripts', function() {
	gulp.src('app/*/*.js')
		.pipe(concat('index.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('index.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

//html
gulp.task('fileinclude', function() {
	gulp.src('app/main/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('dist'));
});

//压缩图片
gulp.task('image', function() {
	gulp.src('img/*.*')
		.pipe(imageMin({
			progressive: true
		}))
		.pipe(gulp.dest('dist/img'))
})

// 默认任务
gulp.task('default', function() {
	gulp.run('lint', 'less', 'scripts', 'fileinclude', 'image');

	// 监听html文件变化
	gulp.watch('app/*/*.html', function() {
		gulp.run('fileinclude');
	});
	// 监听js文件变化
	gulp.watch('app/*/*.js', function() {
		gulp.run('lint', 'scripts');
	});
	// 监听less文件变化
	gulp.watch('app/*/*.less', function() {
		gulp.run('less');
	});
});