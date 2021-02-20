"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();

var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require("gulp-htmlmin");

var pluginsJSpath = [
    'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js'
];

var pluginsCSSpath = [
    'node_modules/perfect-scrollbar/css/perfect-scrollbar.css'
];

gulp.task("flipJS", function () {
    return gulp.src('source/js/page-flip.browser.js')
        .pipe(plumber())
        .pipe(rename("flip.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("pluginsJS", function () {
    return gulp.src(pluginsJSpath)
        .pipe(plumber())
        .pipe(rename("plugins.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("pluginsCSS", function () {
    return gulp.src(pluginsCSSpath)
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(rename("plugins.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("dist/css"))
});

gulp.task("css", function () {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(rename("style.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("dist/css"))
        .pipe(server.stream());
});

gulp.task("images", function () {
    return gulp.src("source/img/**/*.{png,jpg}")
        .pipe(gulp.dest("dist/img"));
});

gulp.task("fonts", function () {
    return gulp.src("source/fonts/*.*")
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task("svgCopy", function () {
    return gulp.src("source/img/svg/*.svg")
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("dist/img/svg"));
});


gulp.task("html", function() {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("dist"));
});

gulp.task("js", function () {
    return gulp.src("source/js/main/*.js")
        .pipe(rename("script.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("clean", function () {
    return del("dist");
});


gulp.task("server", function () {
    server.init({
        server: "dist/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("source/js/**/*.js", gulp.series('js'));
    gulp.watch("source/img/**/*.{jpg,png}", gulp.series("images"));
    gulp.watch("source/*.html", gulp.series("html")).on("change", server.reload);
});

gulp.task("build", gulp.series(
    "clean",
    'flipJS',
    "pluginsCSS",
    "pluginsJS",
    "css",
    "svgCopy",
    "js",
    "images",
    "html",
    "fonts",
));

gulp.task("start", gulp.series("build", "server"));
