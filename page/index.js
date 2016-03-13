/**
 * Created by chenchaochao on 16/3/13.
 */
'use strict';


//load 3rd模块





module.exports=function *(){
    yield this.render('index',{title:"hello world"});
};