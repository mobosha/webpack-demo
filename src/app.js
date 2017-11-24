import './css/common.css';
import Layer from './components/layer/layer.js';
// var $ = require('jquery');
 require('./jqGreen');

const App = function () {
    console.log($('#app'));

    $('#app').green();
    $('#info').html('jquery is loaded.');
    console.log(Layer);
    var dom = document.getElementById('app');
    var layer = new Layer();
    //babel 继承 jsx 这种语法到babel自身,不用下载jsx-loader，只需要在babel内部配置一下，react vue 都是可以通过jsx这种语法写代码，都可以通过babel工具支持jsx语法，不用单独在引入一个loader处理（下载jsx-loader）
    //html就是一串字符串
    //tpl相当于函数可以传递参数，通过模板引擎 显示参数到模板中
    dom.innerHTML = layer.tpl({
        name:'john',
        arr: ['apple', 'xiaomi', 'banana']
    });
}

new App();