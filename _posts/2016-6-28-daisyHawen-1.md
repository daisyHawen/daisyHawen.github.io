---
layout: post
title:  "jQuery深入之源码解析（四）——分离构造器"
date:   2016-06-27 10:17:13
categories: javascript code jqeury
---

继续来看构造函数

```   
    var jQuery = function( selector, context ) {
        return new jQuery.fn.init( selector, context );
        //这里用new，省去了构造函数jQuery()前面的运算符new，因此我们可以直接写jQuery()
    },
    ...
    ;
    jQuery.fn = jQuery.prototype = {
    ....
    };
    //jQuery.extend()和jQuery.fn.extend()，用于合并两个或多个对象的属性到第一个对象
    jQuery.extend = jQuery.fn.extend = function() {
    ...
    };
```

## 分离构造器

 
 通过new操作符构建一个对象，一般经过四步：

  A.创建一个新对象

  B.将构造函数的作用域赋给新对象（所以this就指向了这个新对象）

  C.执行构造函数中的代码

  D.返回这个新对象

  * * *
  最后一点就说明了，我们只要返回一个新对象即可。其实new操作符主要是把原型链跟实例的this关联起来，这才是最关键的一点，所以我们如果需要原型链就必须要new操作符来进行处理。否则this则变成window对象了。

### 我们常常采用的写法

``` 
//声明一个类xjQuery
var t_$=function(){};
var $$ = xjQuery = function(selector) {
        this.selector = selector;
        return this;
    }
    //为类构造prototype
xjQuery.fn = xjQuery.prototype = {
        //构造函数constructor是在对象初始化的瞬间被调用的方法
        //通常constructor的名字与它的类一致
        selectorName: function() {
            return this.selector;
        },
        constructor: xjQuery
    }
    //这里将new声明在外面（常用的手法）
var a = new $$('xxx');
a.selectorName();
```

### 顺便温习一下构造函数

这里`t_$`没有经过构造，
`t_$`声明为Function对象
**全局的Function对象没有自己的属性和方法, 但是, 因为它本身也是函数，所以它也会通过原型链从Function.prototype上继承部分属性和方法。**

***
![这里写图片描述](http://img.blog.csdn.net/20160607103243732)

**Function属性**

- Function.arguments 
以数组形式获取传入函数的所有参数。此属性已被arguments替代。（null）
- Function.caller 
获取调用函数的具体对象。（null）
- Function.length
获取函数的接收参数个数。（0）
- Function.name 
获取函数的名称。（t_$）
- Function.displayName 
获取函数的display name。(这里没有)
- Function.prototype.constructor
***
![这里写图片描述](http://img.blog.csdn.net/20160607104025174)

**Function方法**

- Function.prototype.apply()
在一个对象的上下文中应用另一个对象的方法；参数能够以数组形式传入。argument:(...)
- Function.prototype.bind()
bind()方法会创建一个新函数,称为绑定函数.当调用这个绑定函数时,绑定函数会以创建它时传入 bind()方法的第一个参数作为 this,传入 bind()方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数.
- Function.prototype.call()
在一个对象的上下文中应用另一个对象的方法；参数能够以列表形式传入。
***

- Function.prototype.isGenerator() 
若函数对象为generator，返回true，反之返回 false。（后来没了）
- Function.prototype.toSource() 
获取函数的实现源码的字符串。 覆盖了 Object.prototype.toSource 方法。(后来已经被取消了)
- Function.prototype.toString()
获取函数的实现源码的字符串。覆盖了 Object.prototype.toString 方法。
声明函数的原型构造方法，详细请参考 Object.constructor 。

:不知道这里在哪里继承的，只看到toString(函数)，也许是因为我们定义的是function 而不是Function.
定义的函数ab或者`t_$` 继承自Function()。因而继承它的方法—“_proto_”
![可以再仔细看 其实function()继承自对象object()](http://img.blog.csdn.net/20160607110038057)
(定义一个Function试试呢，还是只有call() bind() apply() toString() ,isGenerator()和toSource()没有看到
anonymous是指我们定义的是匿名函数
![这里写图片描述](http://img.blog.csdn.net/20160607104953270)

到这里应该就明报构造器是怎么回事了

### 回到重点——分离构造器

还是这段代码

```
//声明一个类xjQuery
var t_$=function(){};
var $$ = xjQuery = function(selector) {
        this.selector = selector;
        return this;
    }
    //为类构造prototype
xjQuery.fn = xjQuery.prototype = {
        //构造函数constructor是在对象初始化的瞬间被调用的方法
        //通常constructor的名字与它的类一致
        selectorName: function() {
            return this.selector;
        },
        //constructor: xjQuery
    }
    //这里将new声明在外面（常用的手法）
var a = new $$('xxx');
a.selectorName();
```

看到他的construtor是xjQuery
![这里写图片描述](http://img.blog.csdn.net/20160607111008404)
而如果注释掉constructor的话，它的构造器就是object
![这里写图片描述](http://img.blog.csdn.net/20160607110932372)
即使这样，它还是继承了xjQuery的方法
![这里写图片描述](http://img.blog.csdn.net/20160607111640094)

### 学习jQuery的改进方式

```
var $$ = xjQuery = function(selector) {
    if(!(this instanceof xjQuery)){
        return new xjQuery(selector);
    }
    this.selector = selector;
    return this
}
var a =$$('xxx');
```

但是不能这样写，否则会无限递归，造成死循环

```
var $$ = ajQuery = function(selector) {
    this.selector = selector;
    return new ajQuery(selector);
}
```

jQuery为了避免出现这种死循环的问题，采取的手段是把原型上的一个init方法作为构造器

```
var $$ = ajQuery = function(selector) {
    //把原型上的init作为构造器
    return new ajQuery.fn.init( selector );
}

ajQuery.fn = ajQuery.prototype = {
    name: 'aaron',
    init: function() {
        console.log(this)
    },
    constructor: ajQuery
}
var b=$$('yyy');
```
这里是把init作为构造器

![这里写图片描述](http://img.blog.csdn.net/20160607154441266)

我的理解是，继承实质上是继承构造器的原型函数prototype 而jQuery采取的方式是在prototype中定义一个方法init，通过new这个函数而创建一个新的对象。因此新的对象继承的是init的属性和方法。
即如果

var x= $$('xx')
console.log(x.name)// 为undefined，而不是"aaron"

因为x只继承了init中的方法
我的理解是这样
而jquery中还有一句是
init.prototype = jQuery.fn;
这样init使得原型又指向了jQuery.fn
才得以继承name:'aaron'这样的属性吧

![这里写图片描述](http://img.blog.csdn.net/20160607161155467)

```
ajQuery.fn = ajQuery.prototype = {
    name: 'aaron',
    init: function() {
        console.log(this)
    },
    constructor: ajQuery
}
//新添加的
var init=ajQuery.fn.init;
init.prototype=ajQuery.fn;
var b=$$3('yyy');
```
这样b.name='aaron'

![这里写图片描述](http://img.blog.csdn.net/20160607161415744)


完整demo

```
/一个空的function/
var t_$=function(){};

/*通常构造类的方法*/
var $$1 = xjQuery = function(selector) {
        this.selector = selector;
        return this;
    }
    //为类构造prototype
// xjQuery.fn = xjQuery.prototype = {
xjQuery.prototype = {
        // selectorName:function() {
        //     return this.selector;
        // },
        //构造函数constructor是在对象初始化的瞬间被调用的方法
        //通常constructor的名字与它的类一致
        selectorName: function() {
            return this.selector;
        },
        constructor: xjQuery
    }
    //这里将new声明在外面（常用的手法）
var a = new $$1('xxx');
a.selectorName();


/*改造常规构造方式，自调用函数，在return处加new*/
var $$2 = yjQuery = function(selector) {
    //intanceof 用于判断类型
    if(!(this instanceof yjQuery)){
        //这里只允许调用一次
        return new yjQuery(selector);
    }
    this.selector = selector;
    return this
}
yjQuery.prototype ={
    name:'hanwen',
    xxx:function(){
        return this.name;
    }
}
var c = $$2('xxx');

/*jQuery采用的方式*/
var $$3= ajQuery = function(selector) {
    //把原型上的init作为构造器
    return new ajQuery.fn.init( selector );
}

ajQuery.fn = ajQuery.prototype = {
    name: 'aaron',
    init: function() {
        console.log(this)
    },
    constructor: ajQuery
}
var init=ajQuery.fn.init;
init.prototype=ajQuery.fn;
var b=$$3('yyy');
```