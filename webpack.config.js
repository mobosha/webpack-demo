var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');  //在html中自动引入webpack模块化的代码的插件
var ignorePlugin = new webpack.IgnorePlugin(/\.\/src\/assets\/plugins\/jquery.js/);  //正则匹配路径
var path = require('path');  //path是node原生方法，不需要install

module.exports = {
    // context: __dirname,
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname+'/dist'),  //指定绝对路径，filename不需要指定路径
        filename: 'js/[name].bundle.js' //hash或者chunkhash 可以认为是文件版本号或者md5值，保证每个文件唯一性
    },
    externals:{
        'jquery':'window.jQuery'
    },
    module: {
        loaders:[
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query:{
                    presets:['latest']
                },
                include: path.resolve(__dirname + 'src') ,  //__dirname 是运行环境下的变量，当前运行环境路径 ，生成绝对路径 ；__dirname其实就是根目录
                exclude:  path.resolve(__dirname + 'node_modules')
            },
            {
                test: /\.css$/,
                loader: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: { importLoaders: 1 }},  //importLoaders  在cssloader之后指定几个（前边定义1就是1个）数量的loader来处理import进来的资源
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                loader: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},  //importLoaders  在cssloader之后指定几个（前边定义1就是1个）数量的loader来处理import进来的资源
                    {loader: 'postcss-loader'},
                    {loader: 'less-loader'}  //less-loader 会帮你处理 @import 引入进来的 less 样式，但是css-loader 不会帮你处理@import引入进来的css样式
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.tpl$/,  //监测ejs 或者tpl 结尾的文件  test: /\.ejs$/,
                loader: 'ejs-loader'
            },
            // {
            //     test: /\.(png|jpg|gif|svg)$/i,  //监测ejs 或者tpl 结尾的文件  test: /\.ejs$/,
            //     loader: 'file-loader', //转换成一张图片，http请求再过来图片，享受优势图片缓存，图片访问率比较高时候合适
            //     options:{
            //         name: "[name]-[hash:6].[ext]",  //修改图片打包的输出地址
            //         outputPath: 'assets/'
            //     }
            // },
            {
                test: /\.(png|jpg|gif|svg)$/i,  //监测ejs 或者tpl 结尾的文件  test: /\.ejs$/,
                loaders: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]',  //修改图片打包的输出地址
                            outputPath: 'assets/',
                            limit: 20000,
                            mimetype: 'image/png'  //???
                        }
                    },
                    {
                        loader: 'image-webpack-loader'  //减小图片的体积大小
                    }
                ],  //转换成base64一串字母，只要用到的地方就会有一串base64字母，导致代码冗余，影响文件体积

            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({ //自定义化输出html模板
            filename: 'index.html',  //'index-[hash].html',
            template: 'index.html',  //以根目录的index.html为模板
            inject: 'body',  //1.inject: 'head'所有javascript资源放置在head标签底部，2.inject: 'body'或者inject: true, 所有javascript资源都将放置在body元素的底部,3.或者inject: false 不显示，不添加所有javascript资源
            title: 'Webpack App',
            exChunks: []
        }),
        ignorePlugin
    ]
}