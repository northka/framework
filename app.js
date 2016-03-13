/**
 * Created by chenchaochao on 16/3/13.
 */

"use strict"
//load 3rd lib
let  koa = require('koa');
let  koaRouter = require('koa-router')();
let  favicon = require('koa-favicon');//网站图标
let  nunjucks = require('koa-nunjucks-render');//模板引擎



//  load Primary Library
let  path = require('path');


// load project file
let  router = require('./router/router');  //路由

//initial value
let app = koa();
let debug = process.env.NODE_ENV;


//template setting
app.use(nunjucks('views', {
    ext: '.html',
    noCache: process.env.NODE_ENV === 'development',
    throwOnUndefined: true,
    filters: {
        json: function(str) {
            return JSON.stringify(str, null, 2);
        }
    },
    globals: {
        version: 'v8.0.1'
    }
}));

app.use(function *(next){
    let startTime = new Date().getTime();
    yield next;
    let totalTime = new Date().getTime()-startTime;
    this.set('X-Response-Time', totalTime+'ms');
});


//favicion
app.use(favicon(path.resolve(__dirname,'favicon.ico')));
router(koaRouter, app);
app.use(koaRouter.routes());


app.listen(8000);
