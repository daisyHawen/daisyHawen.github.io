---
layout: post
title:  "Node.js（四）——Express的应用"
date:   2016-11-28 11:02:01 -0500
comments: true
categories: node javascript
---

记得很久以前看了一本书，书名叫做《express开发Node》之类的，忘了具体是什么名字了，这里说这个的原因，就是说用express开发Node 的web确实很快捷，而且它和django基于python还不一样，django框架很大。而express的就比较轻量一点。
express可以让我们很轻易的开发基于MVC模式的网站应用：
所谓MVC (Model-View-Controller,模型视图控制器)是一种软件的设计模式,它最早是 由 20 世纪 70 年代的 Smalltalk 语言提出的,即把一个复杂的软件工程分解为三个层面:模 型、视图和控制器。
 模型是对象及其数据结构的实现,通常包含数据库操作。
 视图表示用户界面,在网站中通常就是 HTML 的组织结构。
 控制器用于处理用户请求和数据流、复杂模型,将输出传递给视图。

很早之前就写过了关于express＋mongoDB的文章，今天又来写一遍，希望有新的收获吧。
[Express+ejs搭建小小网站
](http://blog.csdn.net/sinat_25127047/article/details/50749833)

首先说一下express的命令，可以自动生成一个基于express的nodejs应用，这一点之前不会。确实很强大。
当然，首先你需要装express，这里就不说了。
装好了之后可以通过express -h，查看一下express有哪些功能。
![这里写图片描述](http://img.blog.csdn.net/20170115151132833?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc2luYXRfMjUxMjcwNDc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
这里有两个命令很关键  -v -c -v是指定以什么模版生成 -c是指定以什么css语法生成，默认的模版是jade和css，这里我使用ejs和sass，指定项目名称为myApp。
因此命令如下：
 express  --view=ejs --css=sass myApp
  生成后的目录如下：
  ![这里写图片描述](http://img.blog.csdn.net/20170115151723276?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc2luYXRfMjUxMjcwNDc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
  不过这个项目还不能马上用，需要首先 npm install --save-dev，完毕之后就可以使用了。
  现在我们来看一下每一个文件吧。
  app.js
  

```javascript
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(3000);

```

首先我们导入了 Express 模块,前面已经通过 npm 安装到了本地,在这里可以直接通过 require 获取。
routes 是一个文件夹形式的本地模块,即./routes/index.js,它的功能 是为指定路径组织返回内容,相当于 MVC 架构中的控制器。
通过 express() 函数创建了一个应用的实例,后面的所有操作都是针对于这个实例进行的。
接下来是三个 app.configure 函数,分别指定了通用、开发和产品环境下的参数。 第一个 app.configure 直接接受了一个回调函数,后两个则只能在开发和产品环境中调用。

```javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```
app.set第一个设置views的路径，第二个指定使用什么模版渲染。

app.set 是 Express 的参数设置工具,接受一个键(key)和一个值(value),可用的参 数如下所示。
 basepath:基础地址,通常用于 res.redirect() 跳转。
 views:视图文件的目录,存放模板文件。
 view engine:视图模板引擎。
 view options:全局视图参数对象。
 view cache:启用视图缓存。
 case sensitive routes:路径区分大小写。
 strict routing:严格路径,启用后不会忽略路径末尾的“ / ”。
 jsonp callback:开启透明的 JSONP 支持。

```javascript
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
```
这里用了了5个中间件:bodyParser、cookieParse、router、static 以及 路由控制。 bodyParser 的功能是解析客户端请求,通常是通过 POST 发送的内容。methodOverride 用于支持定制的 HTTP 方法1。
router 是项目的路由支持。
static 提供了静态文件支持。 
errorHandler 是错误控制器。
看最新的API文档，看到express.static(root, [options])的解释：
This is the only built-in middleware function in Express. It serves static files and is based on serve-static.
说static是Express中惟一的内置中间间方法？
提供了静态服务的存放地址，这个没错，我们的css文件以及js、img文件全部都统统放在这里，放在其他地方就不行了。不过唯一的中间件，我就不知道怎么解释了。

# 中间件app.use

再细说一下app.use的用法;
app.use([path,] callback [, callback...])
其实看API文件就能很清楚，第一个参数是路径（可选），第二个参数是回调函数，必须有一个以上的回调函数。
关于路径：

> The path for which the middleware function is invoked; can be any of:
>A path pattern.
>A regular expres
>A regular expression pattern to match paths. 
>An array of combinations of any of the above.
 也就是说这个路径可以是一个路径名比如：'/users'，也可以是一个路径正则匹配'/＊'，也可以缺省。
 指定了路径之后，满足该路径的请求就会执行后面的回调函数。
 缺省的话就是所有请求都执行这个回调函数。

关于回调函数：
有以下几种情况
> A middleware function.
>A series of middleware functions (separated by commas).
>An array of middleware functions.
>A combination of all of the above.

总结就是，可以是中间件函数，可以是一系列中间间函数用comma分割，可以是一个中间间函数的数组，或者是以上所有的情况的综合。

例如：

## 单个中间件函数

```javascript
app.use(function (req, res, next) {
  next();
});
```

一个路由也可以当作一个 中间件函数

```javascript
var router = express.Router();
router.get('/', function (req, res, next) {
  next();
});//一个路由
app.use(router);
```

## 多个中间件函数

```javascript
var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use(r1, r2);
```

## 数组中间件函数

```javascript
var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use('/', [r1, r2]);
```

## 数组，和逗号分隔的中间件函数

```js
function mw1(req, res, next) { next(); }
function mw2(req, res, next) { next(); }

var r1 = express.Router();
r1.get('/', function (req, res, next) { next(); });

var r2 = express.Router();
r2.get('/', function (req, res, next) { next(); });

var subApp = express();
subApp.get('/', function (req, res, next) { next(); });

app.use(mw1, [mw2, r1, r2], subApp);
```

## 关于next

控制权转移
Express 支持同一路径绑定多个路由响应函数,例如:
```js
app.all('/user/:username', function(req, res) { res.send('all methods captured');
});
app.get('/user/:username', function(req, res) {
      res.send('user: ' + req.params.username);
    });
```

但当你访问任何被这两条同样的规则匹配到的路径时,会发现请求总是被前一条路由规 则捕获,后面的规则会被忽略。原因是 Express 在处理路由规则时,会优先匹配先定义的路 由规则,因此后面相同的规则被屏蔽。
Express 提供了路由控制权转移的方法,即回调函数的第三个参数next,通过调用 next(),会将路由控制权转移给后面的规则,例如:

```js

app.all('/user/:username', function(req, res, next) { console.log('all methods captured');
next();
});
app.get('/user/:username', function(req, res) {
      res.send('user: ' + req.params.username);
    });
```
当访问被匹配到的路径时,如 http://localhost:3000/user/carbo,会发现终端中打印了 all methods captured,而且浏览器中显示了 user: carbo。这说明请求先被第一条路由规 则捕获,完成 console.log 使用 next() 转移控制权,又被第二条规则捕获,向浏览器 返回了信息。
这是一个非常有用的工具,可以让我们轻易地实现中间件,而且还能提高代码的复用程 度。例如我们针对一个用户查询信息和修改信息的操作,分别对应了 GET 和 PUT 操作,而 两者共有的一个步骤是检查用户名是否合法,因此可以通过 next() 方法实现:

```js
var users = { 'byvoid': {
        name: 'Carbo',
        website: 'http://www.byvoid.com'
      }
};
app.all('/user/:username', function(req, res, next) { // 检查用户是否存在
if (users[req.params.username]) {
next(); } else {
next(new Error(req.params.username + ' does not exist.')); }
});
app.get('/user/:username', function(req, res) {
// 用户一定存在,直接展示
res.send(JSON.stringify(users[req.params.username])); });
app.put('/user/:username', function(req, res) { // 修改用户信息
res.send('Done');
});
```
上面例子中,app.all 定义的这个路由规则实际上起到了中间件的作用,把相似请求 的相同部分提取出来,有利于代码维护其他next方法如果接受了参数,即代表发生了错误。 使用这种方法可以把错误检查分段化,降低代码耦合度。


## 视图助手

express提供视图助手？说实话我在另外一本书里面并没有看到讲视图助手。。。

视图助手有两类,分别是静态视图助手和动态视图助手。
这两者的差别在于：
静态视图 助手可以是任何类型的对象,包括接受任意参数的函数,但访问到的对象必须是与用户请求无 关的；静态视图助手可以通过 app.helpers() 函数注册,它接受一个对象,对象的每个属性名 称为视图助手的名称,属性值对应视图助手的值。
而动态视图助手只能是一个函数,这个函数不能接受参数,但可以访问 req 和 res 对象。动态视图助手则通过 app.dynamicHelpers() 注册,方法与静态视图助手相同,但每个属性的值必须为一个函数,该函数提供 req 和 res。

这个express3.0＋也变了＝＝

说这个全局全局视图在我们在后面使用 session 时会发现它是非常有用的。
暂时跳过吧，到时候看session怎么用。

## ejs
这里省略了，因为ejs语法和jekyll的liquid语法冲突，无法正确显示。
可以查看原文[Express
](http://blog.csdn.net/sinat_25127047/article/details/54562110)