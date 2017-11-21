var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/script/main.js',  //每个单独代表一个chunk（块）
        a: './src/script/a.js',
        b: './src/script/b.js',
        c: './src/script/c.js'
    },
    output: {
        path: __dirname+'/dist',  //指定绝对路径，filename不需要指定路径
        filename: 'js/[name]-[chunkhash].js',  //hash或者chunkhash 可以认为是文件版本号或者md5值，保证每个文件唯一性
        publicPath: 'http://cdn.com'  //占位符，引用的js文件的路径生成绝对路径，之前是相对路径
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'a.html',  //'index-[hash].html',
            template: 'index.html',  //以根目录的index.html为模板
            inject: false,  //1.inject: 'head'所有javascript资源放置在head标签底部，2.inject: 'body'或者inject: true, 所有javascript资源都将放置在body元素的底部,3.或者inject: false 不显示，不添加所有javascript资源
            title: 'webpack is a.html', //修改html中title内容，<title><%= htmlWebpackPlugin.options.title %></title>
            date: new Date,  //修改body中显示的内容，显示时间 <%= htmlWebpackPlugin.options.date %>
            // minify:{
            //     removeComments: true, //删除注释
            //     collapseWhitespace: true  //删除空格
            // },   //对生成html压缩
            //chunks: ['main', 'a'],  //当前html需要引入的chunks（块）
            excludeChunks: ['b','c']  //排除(不要引入)的chunks
        }),
        new htmlWebpackPlugin({
            filename: 'b.html',  //'index-[hash].html',
            template: 'index.html',  //以根目录的index.html为模板
            inject: false,  //1.inject: 'head'所有javascript资源放置在head标签底部，2.inject: 'body'或者inject: true, 所有javascript资源都将放置在body元素的底部,3.或者inject: false 不显示，不添加所有javascript资源
            title: 'webpack is b.html', //修改html中title内容，<title><%= htmlWebpackPlugin.options.title %></title>
            date: new Date,  //修改body中显示的内容，显示时间 <%= htmlWebpackPlugin.options.date %>
            // minify:{
            //     removeComments: true, //删除注释
            //     collapseWhitespace: true  //删除空格
            // },   //对生成html压缩
            //chunks: ['b'],  //当前html需要引入的chunks（块）
            excludeChunks: ['c','a']  //排除(不要引入)的chunks
        }),
        new htmlWebpackPlugin({
            filename: 'c.html',  //'index-[hash].html',
            template: 'index.html',  //以根目录的index.html为模板
            inject: false,  //1.inject: 'head'所有javascript资源放置在head标签底部，2.inject: 'body'或者inject: true, 所有javascript资源都将放置在body元素的底部,3.或者inject: false 不显示，不添加所有javascript资源
            title: 'webpack is c.html', //修改html中title内容，<title><%= htmlWebpackPlugin.options.title %></title>
            date: new Date,  //修改body中显示的内容，显示时间 <%= htmlWebpackPlugin.options.date %>
            // minify:{
            //     removeComments: true, //删除注释
            //     collapseWhitespace: true  //删除空格
            // },   //对生成html压缩
            //chunks: ['c'],  //当前html需要引入的chunks（块）, chunks 和 excludeChunks 两个参数只需要引入一个参数就行，一个是需要引入，一个是不需要引入
            excludeChunks: ['b','a']  //排除(不要引入)的chunks
        })
    ]
}