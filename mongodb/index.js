/**
 * Created by chenchaochao on 16/3/21.
 */

"use strict";

let mongodb = require('mongodb');

let mongodbConf = require('../conf/mongodb').mongodb;

let mongoUrl = 'mongodb://' + mongodbConf.host + ':' + mongodbConf.port+'/'+'tests' ;
let mongoConnect;
/**
 * mongodb 数据库连接
 * @returns {Promise}
 */
exports.connect = function(){
    return new Promise(function(resolve,reject){
        if(mongoConnect){
            resolve(mongoConnect);
        }else {
            mongodb.connect(mongoUrl,(err,db)=>{
                if(err){

                    console.info(err);
                    reject(err);
                }else {
                    db.on('close',dbCloseHandler);
                    db.on('error',dbErrorHandler);
                    mongoConnect = db;
                    resolve(db);
                    console.info('pid : %d connercted',process.pid);
                }
            })
        }
    })
};

exports.connect();
function dbCloseHandler(err){
    console.info(err);
}


function dbErrorHandler(err){
    console.info(err)
}