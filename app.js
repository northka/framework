/**
 * Created by chenchaochao on 16/3/13.
 */

"use strict"
//load 3rd lib
let  koa = require('koa');
let  koaRouter = require('koa-router')();
let  favicon = require('koa-favicon');//网站图标
let  nunjucks = require('koa-nunjucks-render');//模板引擎
let  compress = require('koa-compress'); // 压缩
let  open = require('open');



//  load Primary Library
let  path = require('path');
let  util = require('util');


// load project file
let  router = require('./router/router');  //路由
//let  mongodb = require('./mongodb');

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

app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));


//webpack
if(debug){
    let webpackDevMiddleware = require('koa-webpack-dev-middleware')
    let webpack = require('webpack');
    let webpackConf = require('./webpack.config');
    app.use(webpackDevMiddleware(webpack(webpackConf({debug:debug})), webpackConf.devServer))
}


////mongo数据库连接
//function mongodbInsert(doc){
//    mongodb.connect()
//        .then(function(db){
//            db.collection('tests')
//            .insertOne(doc,function(err,result){
//                if(err){
//                    console.error(err);
//                }else{
//                    //console.info(result);
//                }
//            })
//        });
//}

//setTimeout(function(){
//    for(var i = 0; i < 100000; i++){
//        mongodbInsert({
//            name:111,
//            num:Math.random()*10000
//        });
//        console.log(i);
//    };
//},1000);


app.listen(8000,()=>{
    let url = util.format('http://%s:%d', 'localhost', 8000);
});




