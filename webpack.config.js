var htmlWebpackPlugin = require('html-webpack-plugin');  //在html中自动引入webpack模块化的代码的插件
var path = require('path');  //path是node原生方法，不需要install

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname+'/dist'),  //指定绝对路径，filename不需要指定路径
        filename: 'js/[name].bundle.js' //hash或者chunkhash 可以认为是文件版本号或者md5值，保证每个文件唯一性
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
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',  //'index-[hash].html',
            template: 'index.html',  //以根目录的index.html为模板
            inject: 'body',  //1.inject: 'head'所有javascript资源放置在head标签底部，2.inject: 'body'或者inject: true, 所有javascript资源都将放置在body元素的底部,3.或者inject: false 不显示，不添加所有javascript资源

            excludeChunks: ['b','c']  //排除(不要引入)的chunks
        })
    ]
}