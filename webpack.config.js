/**
 * Created by chenchaochao on 16/3/13.
 */
'use strict';

// load 3rd module
let webpack = require('webpack');
let _ = require ('lodash');
let glob = require('glob');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");

let path = require('path');

//config
let views = path.resolve(process.cwd(), 'views');
let assets = 'assets';

let getPages = ()=>{
    let pagePath = path.resolve(process.cwd(),'js');
    let pageJs = glob.sync(pagePath + '/*.{js,jsx}');
    let entryPages = {};
    pageJs.forEach(function(filePath){
        let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        entryPages[fileName] = filePath;
    });
    return entryPages;
};

let setCss =(debug,plugins)=>{
    let cssConfig = {};
    if(debug){
        // 开发阶段，css直接内嵌
        cssConfig.cssLoader = 'style!css';
        cssConfig.scssLoader = 'style!css!sass'
    }else {
        cssConfig.cssLoader = ExtractTextPlugin.extract('style', 'css?minimize'); // enable minimize
        cssConfig.scssLoader = ExtractTextPlugin.extract('style', 'css?minimize', 'sass');
        plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        );
    }
    return cssConfig;
};
module.exports = (opt)=>{
    let option = opt ||{};


    let debug = opt.debug !== undefined ? opt.debug : true;
    let publicPath = '';
    let plugins = [];


    let pages = getPages();
    let cssConfig = setCss(debug,plugins);



    let configure = {
        entry:pages,
        output:{
            path: path.resolve(assets),
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? 'chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },
        module:{
           loaders:[
               {test: /\.css$/, loader: cssConfig.cssLoader},
               {test: /\.scss$/, loader: cssConfig.scssLoader},
               {test:/\.jsx?$/, exclude: /node_modules/,loader: 'babel?presets[]=react,presets[]=es2015'}
           ]
        },
        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    };

    return configure;
};