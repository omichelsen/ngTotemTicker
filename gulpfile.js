var gulp = require('gulp');

var prefix = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var path = require('path');

var paths = {
	build: './build',
	scripts: ['./src/**/*.js'],
	styles: ['./src/**/*.less']
};

gulp.task('clean', function () {
	gulp.src(paths.build, {read: false})
		.pipe(clean({force: true}));
})

gulp.task('scripts', function () {
	return gulp.src(paths.scripts)
		.pipe(concat('ngTotemTicker.js'))
		.pipe(gulp.dest('build'))
		.pipe(uglify())
		.pipe(rename('ngTotemTicker.min.js'))
		.pipe(gulp.dest(paths.build));
});

gulp.task('less', function () {
	return gulp.src(paths.styles)
		.pipe(less({
			paths: paths.styles
		}))
		.pipe(prefix('last 2 versions'))
		.pipe(rename('ngTotemTicker.css'))
		.pipe(gulp.dest(paths.build));
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['less']);
});

gulp.task('default', ['clean', 'scripts', 'less', 'watch']);