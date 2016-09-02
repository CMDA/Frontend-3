var gulp = require('gulp'),
	del = require('del'),
	inject = require('gulp-inject'),
	browserSync = require('browser-sync').create()

// Clean out the tmp dir
gulp.task('clean', function (){
	return del(['tmp/**/*'])
})

// Inject html, css and js
gulp.task('inject', ['clean'], function (){
	return gulp.src('./src/**/*.html')
		// Inject only main.css in index.html
		.pipe(inject(gulp.src('./src/*.css', {read:false}), {name:'main', relative:true}))
		// Inject links to all examples in the main html file
		.pipe(inject(gulp.src(['./src/**/*.html', '!./src/index.html', '!./src/data/*.html'], {read:false}), {transform: function (filepath) {
			return '<li><a href="'+ filepath +'">'+filepath+'</a></li>'
		}, relative:true}))
		// Inject .css and .js files
		.pipe(inject(gulp.src('./src/**/*.css', {read:false}), {relative:true}))
		.pipe(inject(gulp.src('./src/**/*.js', {read:false}), {relative:true}))
		// Move the html files to ./tmp
		.pipe(gulp.dest('./tmp'))
})

// Move css and js
gulp.task('move', ['inject'], function (){
	return gulp.src(['src/**/*.css', 'src/**/*.js', 'src/data/**'], {
		base:'src'
		}).pipe(gulp.dest('./tmp'))
})

// Serve from the temp dir
gulp.task('serve', ['move'], function (){
	return browserSync.init({server: {
		baseDir: "./tmp"
	}})
})

gulp.task('reload', ['move'], function (){
	browserSync.reload();
})

gulp.task('default', ['serve'], function (){
	gulp.watch(['src/**/*.html', 'src/**/*.css', 'src/**/*.js'], ['reload'])
})
// EOF