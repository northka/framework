/**
 * Created by chenchaochao on 16/5/30.
 */

'use strict';

let productionConfig = require('./webpack.config');

module.exports =  productionConfig({
    debug:false
});
