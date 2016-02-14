var gulp = require('gulp');
var elixir = require('laravel-elixir');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev-all');
var del = require('del');

elixir.config.production = true;

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var paths = {
    'bower': './vendor/bower_components/',
    'bootstrap': './vendor/bower_components/bootstrap/',
    'fontawesome': './vendor/bower_components/font-awesome/',
    'jquery': './vendor/bower_components/jquery/',
    'jstz': './vendor/bower_components/jstzdetect/',
    'pusher': './vendor/bower_components/pusher/'
};

var assets = './resources/assets/';

elixir.extend('imagemin', function (src, output) {
    new elixir.Task('imagemin', function () {
        return gulp.src(src)
            .pipe(imagemin())
            .pipe(gulp.dest(output));
    }).watch(src);
});

elixir.extend('revision', function (src, output) {
    new elixir.Task('revision', function () {
        del(output);
        rev = new rev({replacer: function(fragment, replaceRegExp, newReference, referencedFile) {
            fragment.contents = fragment.contents.replace(replaceRegExp, '$1' + newReference + '$3$4');
        }});
        return gulp.src(src)
            .pipe(rev.revision())
            .pipe(gulp.dest(output))
            .pipe(rev.manifestFile())
            .pipe(gulp.dest(output));
    }).watch(src);
});

elixir(function (mix) {

    // Compile LESS
    mix.less('_boot.less', 'build/css/app.css', {
        paths: ['.', paths.bower]
    });

    // Copy fonts
    mix.copy(paths.bootstrap + "fonts/**", 'build/fonts');
    mix.copy(paths.fontawesome + "fonts/**", 'build/fonts');

    // Concatenate vendor scripts
    mix.scripts([
        paths.jquery + "dist/jquery.min.js",
        paths.bootstrap + "js/alert.js",
        paths.bootstrap + "js/button.js",
        paths.bootstrap + "js/collapse.js",
        paths.bootstrap + "js/dropdown.js",
        paths.bootstrap + "js/modal.js",
        paths.bootstrap + "js/tooltip.js",
        paths.bootstrap + "js/popover.js",
        paths.bootstrap + "js/tab.js",
        paths.bootstrap + "js/transition.js",
        paths.jstz + "jstz.min.js",
        paths.pusher + "dist/pusher.min.js"
    ], 'build/js/vendor.js', './');

    // Concatenate app scripts
    mix.scripts([
        'app.js'
    ], 'build/js/app.js', 'resources/assets/js');

    // Minify images
    mix.imagemin(elixir.config.assetsPath + '/img/**/*', 'build/img');
    mix.imagemin(elixir.config.assetsPath + '/img/favicon.ico', 'public');

    // Version everything
    mix.revision('build/**/*', 'public/build');
});