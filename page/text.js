/**
 * Created by chenchaochao on 16/3/23.
 */
'use strict';


//load 3rd模块


module.exports=function *(){
    yield this.render('text',{title:"hello world"});
};