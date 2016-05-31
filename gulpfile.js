/**
 * Created by chenchaochao on 16/5/30.
 */
'use strict';
let path = require('path')

let gulp = require('gulp')
let webpack = require('webpack')
let gutil = require('gulp-util')

let webpackProConfig = require('./webpack-production.config')


//config
let dest = path.resolve(process.cwd(), 'assets');

// clean assets
gulp.task('clean', () => {
    let clean = require('gulp-clean');

    return gulp.src(dest, {read: true}).pipe(clean());
});


// run webpack pack
gulp.task('pack', ['clean'], (done) => {
    webpack(webpackProConfig, (err, stats) => {
        if(err) throw new gutil.PluginError('webpack', err)
        gutil.log('[webpack]', stats.toString({colors: true}))
        done()
    })
})

//css minify
gulp.task('css-minify',()=>{
    let cssMinify = require('gulp-minify-css');

    gulp.src(dest+'/css/*.css')
        .pipe(cssMinify())
        .pipe(gulp.dest(dest));
})
