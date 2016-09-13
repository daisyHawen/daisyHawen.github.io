---
layout: post
title:  " Javascript模块化编程——使用AMD，CommonJS，ES Harmony"
date:   2016-09-08 19:17:13
categories: html5
---
定一个小目标，每周翻译一篇国外优秀博客
原文链接 https://addyosmani.com/writing-modular-js/
以及参考了 http://nuysoft.com/2014/01/24/authoring-umd-modules/
http://www.ruanyifeng.com/blog/2012/11/require_js.html

#AMD-异步模块规范
**个人理解：**
首先AMD模式，所谓异步模块加载。
就是先加载数组里面得模块，然后等到加载完毕，才执行匿名函数。

随着RequireJS成为最流行的实现方式，异步模块规范（AMD）在前端界已经被广泛认同。
它采用异步方式加载模块，**模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。**
```
    //    文件名: foo.js
    define(["jquery"], function ($) {
        //    方法
        function myFunc(){};

        //    暴露公共方法
        return myFunc;
    });
```
AMD也采用require()语句加载模块，但是不同于CommonJS，它要求两个

```
require([module], callback);参数[module]
```

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数callback，则是加载成功之后的回调函数。如果将前面的代码改写成AMD形式，就是下面这样：

```
　require(['math'], function (math) {
　　　　math.add(2, 3);
　　});
```
#CommonJS

个人理解：
commonJS的规范是用nodeJS引出来的。
但是浏览器前端是不能直接用的，需要有browserify。

因为有Browserify，它也一直被前端界广泛认同。
就像前面的格式一样，下面是用CommonJS规范实现的foo模块的写法：

```
//    文件名: foo.js
    //    依赖
    var $ = require("jquery");
    //    方法
    function myFunc(){};

    //    暴露公共方法（一个）
    module.exports = myFunc;
```

##requireJS
###为什么要使用requireJS
最早的时候，所有Javascript代码都写在一个文件里面，只要加载这一个文件就够了。后来，代码越来越多，一个文件不够了，必须分成多个文件，依次加载。下面的网页代码，相信很多人都见过。

```
　　<script src="1.js"></script>
　　<script src="2.js"></script>
　　<script src="3.js"></script>
　　<script src="4.js"></script>
　　<script src="5.js"></script>
　　<script src="6.js"></script>
```

首先需要去官网下载requireJS

下载后，假定把它放在js子目录下面，就可以加载了。

```
　<script src="js/require.js"></script>
```

#UMD模式
然后我现在要学习的就是这个模式。

如果是在**浏览器**中运行代码，那么 AMD 模块 是个非常好的选择。
如果运行在**服务端环境**，例如 RingoJS 或 node.js，那么 CommonJS 模块 是最简单的选择。

**一个AMD包裹为UMD的例子**
```
(function (define) {

    // dependencies are listed in the dependency array
    define(['./store', 'meld'], function (store, meld) {
        "use strict";
        var cache = {};

        // create the module
        meld.around(store, 'get', function (jp) {
            var key = jp.args.join('|');
            return key in cache ? cache[key] : cache[key] = jp.proceed();
        };

        // return your module's exports
        return store;
    });

}(
    typeof define == 'function' && define.amd
        ? define
        : function (ids, factory) {
            var deps = ids.map(function (id) { return require(id); });
            module.exports = factory.apply(null, deps);
        }
));
```
整个模块被包裹在一个 IIFE 中，并且函数 define 被作为一个参数传入。
文件最后的代码片段 typeof define == 'function' && define.amd 是嗅探 AMD 环境的标准方式。
如果检测结果为 true，--define 则说明当前环境是 AMD，可以把全局函数 define 传入 IIFE。通过由**工厂函数*返回一个值，模块以正常的 AMD 方式输出。

如果 AMD 环境嗅探的结果为 false，代码则模拟一个类似 node.js 的 CommonJS 环境。为了使 AMD 代码能够运行，IIFE 注入了一个行为类似于 AMD define 的函数：把所有的 ids 加载为模块，并把它们作为参数注入工厂函数。然后，函数 define 获取到工厂函数的返回值，并以经典的 node.js 方式赋值给 module.exports。

感觉下面的例子好理解一点：
```
(function (root, factory) {
        if (typeof define === "function" && define.amd) {
            // AMD
            define(["jquery"], factory);
        } else if (typeof exports === "object") {
            // Node, CommonJS之类的
            module.exports = factory(require("jquery"));
        } else {
            // 浏览器全局变量(root 即 window)
            root.returnExports = factory(root.jQuery);
        }
    }(this, function ($) {
        //    方法
        function myFunc(){};

        //    暴露公共方法
        return myFunc;
    }));
```
下面是更复杂的例子，它依赖了多个组件并且暴露多个方法:
```
 (function (root, factory) {
        if (typeof define === "function" && define.amd) {
            // AMD
            define(["jquery", "underscore"], factory);
        } else if (typeof exports === "object") {
            // Node, CommonJS之类的
            module.exports = factory(require("jquery"), require("underscore"));
        } else {
            // 浏览器全局变量(root 即 window)
            root.returnExports = factory(root.jQuery, root._);
        }
    }(this, function ($, _) {
        //    方法
        function a(){};    //    私有方法，因为它没被返回 (见下面)
        function b(){};    //    公共方法，因为被返回了
        function c(){};    //    公共方法，因为被返回了

        //    暴露公共方法
        return {
            b: b,
            c: c
        }
```
一个用UMD模式写的print.js
```
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        //检测是否为AMD模式
        define([], factory);//这里没有引用包或者库，第一个数组为空
    } else {
     // 浏览器全局变量(root 即 window)
        root.Printer = factory(root);
    }
}(this, function(root) {
    var Printer = {};
    Printer.printer = {
        "version": "0.0.1"
    };
    var init_options = {
        "speed": 50, //文字的速度
        "selector": 'canvas', //要打印到的标签的ID          
        "startIndex": 0, //从第几个字符开始打印
        "endIndex": 0, //打印到第几个字符结束
        "hasCur": true, //是否有光标
        "curId": 'cur', //光标的ID
        "curStr": '_', //光标字符
        "curStyle": 'font-weight: bold;', //光标的样式（CSS样式）
        "curSpeed": 100, //光标的速度（ms）
        "lnStr": ""
    };

    var str = "",
        options = init_options;
    var flwCurTimer, dom, curObj, reStr = '',
        curSwitch, index = 0;

    Printer.init = function(arg_str, arg_options) {
        console.log('init');
        console.log(arg_str);
        console.log(arg_options);
        str = arg_str;
        for (var option in arg_options) {
            options[option] = arg_options[option];
        }
        dom = document.getElementById(options.selector);
        index = options.startIndex;
        options.endIndex = options.endIndex == 0 ? str.length : options.endIndex
        options.hasCur && flwCur();
        return this;
    }


    Printer.print = function() { //打印函数
        console.log('print');
        for (var i = 0; i < str.length; i++) {
            (function(index) {
                setTimeout(function() {
                    console.log('index: ' + index);
                    if (str.charAt(index) === '\n') {
                        reStr += '<br>' + options.lnStr;
                    } else {
                        reStr += str.charAt(index);
                    }
                    dom.innerHTML = options.lnStr + reStr;
                    // console.log(reStr);
                    // console.log(dom.innerHTML);
                }, options.speed * (index + 1))
            })(i);
        }

        setTimeout(function() {
            if (options.hasCur) {
                var element = document.createElement("span");
                element.id = options.curId
                dom.appendChild(element);

                curObj = document.getElementById(options.curId);
                clearTimeout(flwCurTimer);
                setInterval(chCur, options.curSpeed);
            }
        }, options.speed * str.length)
    }

    function flwCur() { //跟随光标
        console.log('flwCur');
        dom.innerHTML += '<span id="' + options.curId + '" style="' + options.curStyle + '">' + options.curStr + '</span>';
        flwCurTimer = setTimeout(flwCur, 1.5 * options.speed);
    }

    function chCur() { //闪烁光标
        // console.log('chCur');
        curObj.innerHTML = curSwitch ? options.curStr : "";
        curSwitch = !curSwitch
    }

    return Printer;//Printer是公有方法
}));
```