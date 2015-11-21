var gulp = require('gulp');
var postcss = require('gulp-postcss');
var stylus = require('gulp-stylus');
var plumber = require('gulp-plumber');
var autoprefixer = require('autoprefixer');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var mqpacker = require('css-mqpacker');
var postcssSVG = require('postcss-svg');
var lost = require('lost');
var browserSync = require('browser-sync');
var cssnano = require('cssnano');
var sprites = require('postcss-sprites');
var config = require('../config').stylus;

var spriteOption = {
	stylesheetPath: config.dest,
	spritePath: './build/img/sprite/sprite.png',
	filterBy: function (image) {
		return /sprite\/[a-zA-Z\d\S\s]*\.png$/gi.test(image.url);
	},
	retina: true,
	padding: 10
};

var postCssOption = [
	autoprefixer({browsers: config.browsers}),
	lost,
	postcssSVG({
		paths: [
			'../img/svg/iconsInline/',
			'./build/img/svg/iconsInline/'
		]
	})
];

gulp.task('stylus', function () {
	gulp.src(config.src)
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(stylus())
		.pipe(postcss(postCssOption))
		.pipe(postcss([sprites(spriteOption),cssnano(), mqpacker()]))
		.pipe(gulp.dest(config.dest));
});

gulp.task('stylus-dev', function () {
	gulp.src(config.src)
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(postcss(postCssOption))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('stylus-styleGuide', function (cb) {
	var processors = [
		autoprefixer({browsers: config.browsers}),
		lost,
		postcssSVG({
			paths: [
				'../img/svg/iconsInline/',
				'./styleGuide/img/svg/iconsInline/'
			]
		}),
		sprites(spriteOption)
	];
	gulp.src(config.src)
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(stylus())
		.pipe(postcss(processors))
		.pipe(gulp.dest(config.styleGuide))
		.on('end', function () {
			cb();
		});
});