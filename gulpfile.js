const { src, dest, watch, parallel, series }  = require('gulp');

const scss              = require('gulp-sass');
const concat            = require('gulp-concat');
const browserSync       = require('browser-sync').create();
const uglify            = require('gulp-uglify-es').default;
const autoprefixer      = require('gulp-autoprefixer');
const imagemin          = require('gulp-imagemin');
const del               = require('del');
const realFavicon       = require ('gulp-real-favicon');
const fs                = require('fs');
const FAVICON_DATA_FILE = 'faviconData.json';

function browsersync() {
    browserSync.init({
        server:{
            baseDir: 'app/'
        }
    })
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/img'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/inputmask/dist/jquery.inputmask.min.js',
        'node_modules/jquery-validation/dist/jquery.validate.min.js',
        'node_modules/owl.carousel/dist/owl.carousel.min.js',
        'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        'node_modules/bootstrap/scss/bootstrap-grid.scss',
        'node_modules/owl.carousel/src/scss/owl.carousel.scss',
        'node_modules/owl.carousel/src/scss/owl.theme.default.scss',
        'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
        'app/scss/style.scss',
    ])
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function generatefavicon(done) {
	realFavicon.generateFavicon({
		masterPicture: 'app/img/favicon.png',
		dest: 'dist',
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {
				design: 'raw'
			},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
};

function injectfaviconmarkups() {
	return src(['dist/*.html', 'dist/misc/*.html'])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(dest('dist'));
};

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/webfonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
        'app/*.php'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles               = styles;
exports.watching             = watching;
exports.browsersync          = browsersync;
exports.scripts              = scripts;
exports.cleanDist            = cleanDist;
exports.images               = images;
exports.generatefavicon      = generatefavicon;
exports.injectfaviconmarkups = injectfaviconmarkups;

exports.build   = series(cleanDist, images, generatefavicon, build, injectfaviconmarkups);
exports.default = parallel(styles, scripts, browsersync, watching);