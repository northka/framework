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

let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

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

let setCss = (debug,plugins)=>{
    let cssConfig = {};
    if(debug){
        // 开发阶段，css直接内嵌
        cssConfig.cssLoader = 'style!css';
        cssConfig.scssLoader = 'style!css!sass';

    }else {
        cssConfig.cssLoader = ExtractTextPlugin.extract('style', 'css?minimize'); // enable minimize
        cssConfig.scssLoader = ExtractTextPlugin.extract('style', 'css?minimize!sass');
        plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        );

        //js uglyfy
        plugins.push(new UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }))
    }
    return cssConfig;
};

let setJsp = (debug,plugins)=>{
    if(!debug){
        let viewsPath = path.resolve(process.cwd(),'views');
        let views = glob.sync(viewsPath + '/*.jsp');

        views.forEach(function (filePath){
            let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
            let conf = {
                template: filePath,
                filename: fileName + '.jsp',
                inject:'body',
                chunks:fileName,
                minify:{    //压缩HTML文件
                    removeComments:true,    //移除HTML中的注释
                    removeCommentsFromCDATA:true,
                    collapseWhitespace:false    //删除空白符与换行符
                }
            };

            plugins.push(new HtmlWebpackPlugin(conf))
        })
    }
}
module.exports =(opt)=>{
    let option = opt ||{};


    let debug = option.debug !== undefined ? option.debug : true;
    let publicPath = '';
    let plugins = [];


    let pages = getPages();
    let cssConfig = setCss(debug,plugins);
    setJsp(debug,plugins);



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
               {
                   test: /\.(jpe?g|png|gif|svg)$/i,
                   loaders: [
                       'image?{bypassOnDebug: true, progressive:true, \
                           optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                       // url-loader更好用，小于65KB的图片会自动转成dataUrl，
                       // 否则则调用file-loader，参数直接传入
                       'url?limit=65000&name=img/[hash:8].[name].[ext]'
                   ]
               },
               {
                   test: /\.(woff|eot|ttf|woff2)$/i,
                   loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
               },
               {test: /\.css$/, loader: cssConfig.cssLoader},
               {test: /\.scss$/, loader: cssConfig.scssLoader},
               {test:/\.jsx?$/, exclude: /node_modules/,loaders: ['babel?presets[]=react,presets[]=es2015','eslint-loader']}
           ]
        },
        plugins:plugins
        ,
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


