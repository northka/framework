/**
 * Created by chenchaochao on 16/3/13.
 */
'use strict';

//load 页面渲染模块
let index = require('../page/index');

module.exports = function(router,app){
    router.get('/',index);
};