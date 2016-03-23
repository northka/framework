/**
 * Created by chenchaochao on 16/3/13.
 */
'use strict';

//load 页面渲染模块
let index = require('../page/index');
let text = require('../page/text');

module.exports = function(router,app){
    router.get('/',index);
    router.get('/text',text);
};

