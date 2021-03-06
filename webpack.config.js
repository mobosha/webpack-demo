var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');  //在html中自动引入webpack模块化的代码的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Create multiple instances
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');

var ignorePlugin = new webpack.IgnorePlugin(/\.\/src\/assets\/plugins\/jquery.js/);  //正则匹配路径
var path = require('path');  //path是node原生方法，不需要install

module.exports = {
    // context: __dirname,
    // noParse: [],
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname+'/dist'),  //指定绝对路径，filename不需要指定路径
        // publicPath: './dist', //这里必须是反斜杠且devServer.proxy.target必须存在，不然到时候index.html  script src路劲会找不到
        filename: 'js/[name].bundle.js',  //hash或者chunkhash 可以认为是文件版本号或者md5值，保证每个文件唯一性
        //chunkFilename: "chunk/[name].chunk.js"
    },
    devServer: {
        inline: true, //设置为true，代码有变化，浏览器端刷新。
        open: true, //:在默认浏览器打开url(webpack-dev-server版本> 2.0)
        port: 8088,  //http://blog.csdn.net/qq_16559905/article/details/78277642,有关这块的配置
        // compress: true, //使用gzip压缩
        // host: '10.0.0.9',//ip地址，同时也可以设置成是localhost,
        progress: true, //让编译的输出内容带有进度和颜色
        historyApiFallback: true, //回退:支持历史API。
        contentBase: "dist/", //本地服务器所加载的页面所在的目录
        // proxy: {
        //     '*': {
        //         target: 'http://127.0.0.1:80', //跨域Ip地址
        //         secure: false
        //     }
        // },
        // proxy: { //貌似修改接口请求地址
        //     '/api': {
        //         //target: 'https://api.github.com',
        //         //pathRewrite: {'^/api' : '/campaign_huggies/t3store_freeuse/admin'}, //给地址里的api改成/campaign_huggies/t3store_freeuse/admin；这样 http://localhost:8080/api/getUser.php 的请求就是后端的接口 http://user.reekly.com/campaign_huggies/t3store_freeuse/admin/getUser.php 了
        //         target: "http://localhost:3000", //对/api用户的请求现在会将请求代理到http://localhost:3000/api/users
        //         pathRewrite: {"^/api" : ""},  //如果你不想/api传递（暴露），我们需要重写路径
        //         secure: false, //target: "https://other-server.example.com",地址里边有https：在HTTPS上运行的后端服务器将使用无效证书，默认情况下不会被接受。如果你想要，像这样修改你的配置：
        //         changeOrigin: true
        //     }
        // },
        // proxy: { //ajax请求
        //     '/ajax/*': 'http://your.backend/'
        // }
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
                    cacheDirectory: './webpack_cache/',
                    presets:['latest']
                },
                include: path.resolve(__dirname + 'src') ,  //__dirname 是运行环境下的变量，当前运行环境路径 ，生成绝对路径 ；__dirname其实就是根目录
                exclude:  path.resolve(__dirname + 'node_modules')
            },
            {
                test: /\.css$/,
                loader:  extractCSS.extract({
                    fallback: 'style-loader',
                    use:[
                        // {loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true
                            }
                        },  //importLoaders  在cssloader之后指定几个（前边定义1就是1个）数量的loader来处理import进来的资源
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },
            {
                test: /\.less$/i,  //i 不区分大小写 less LESS
                loader: extractLESS.extract({
                    fallback: 'style-loader',
                    use: [
                        // {loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },  //importLoaders  在cssloader之后指定几个（前边定义1就是1个）数量的loader来处理import进来的资源
                        {loader: 'postcss-loader'},
                        {loader: 'less-loader'}  //less-loader 会帮你处理 @import 引入进来的 less 样式，但是css-loader 不会帮你处理@import引入进来的css样式
                    ]
                })
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
        extractCSS,
        extractLESS,
        ignorePlugin,
        // new webpack.HotModuleReplacementPlugin()   //貌似没啥用处？ 热加载 webpack-dev-server 前身貌似
        // new ExtractTextPlugin("styles.css")
    ]
}