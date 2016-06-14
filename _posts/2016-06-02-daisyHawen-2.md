---
layout: post
title:  "Html5——本地数据库"
date:   2015-06-08 19:17:13
categories: html5
---

# 本地存储

- sessionStorage
- localStorage
sessionStorage.setItem('key','value')
变量=sessionStorage.getItem('key','value')

* * *

或者
sessionStorage.key='value'
变量=sessionStorage.key

* * *

localStorage.setItem('key','value')
localStorage.getItem('key','value')

* * *

或者
localStorage.key='value'
变量=localStorage.key

## 简单示例

localstorage.html
storage.js

# 本地数据库

本地数据库是H5之后出现的SQLLite数据库，可以通过SQL语言来访问文件型SQL数据库
使用数据库的步骤：

1 创建访问数据库

2 使用事务处理


## 创建访问数据库对象#

var db= openDatabase('mydb','1.0','TestDB',2*1024*1024)
第一个参数：数据库名
第二个参数：版本号
第三个参数：数据库描述
第四个参数：数据库大小
该方法返回创建后的数据库访问对象，如果该数据库不存在，则创建数据库

## 用executeSql执行查询

transaction.executeSql(sqlquery,[],dataHandler,errorHandler);
第一个参数：查询语句
第二个参数：查询语句中的？
eg: transaction.executeSql("UPDATE people set age=? which name=?",[age,name])
第三个参数：执行成功时调用的回调函数
function dataHandler(transaction,result){//回调函数内容}
第四个参数：执行失败时调用的回调函数
function errorHandler(transaction,erromsg){//alert("执行出错！")}

## transaction


```
//查询数据表中的数据
        this.db.transaction(function(tx){
            //创建数据表，如果不存在MsgData就创建，不然就不创建
            tx.executeSql('CREATE TABLE IF NOT EXISTS MsgData(name TEXT, message TEXT,time INTEGER) ',[]);
            //查询数据表中的数据，rs是返回的数据，tx是事务
            tx.executeSql('SELECT *FROM MsgData',[],function(tx,rs){
                note.removeAllData();//用this.removeAllData()不行
                console.log(rs);
                for(var i=0;i<rs.rows.length;i++){
                    note.showData(rs.rows[i]);
                }
            });
        });
```




```

//向数据表中插入一条数据
       this.db.transaction(function(tx){
            tx.executeSql('INSERT INTO MsgData VALUES(?,?,?)',[name,message,time],function(tx,ts) {
                alert("成功保存数据！");
            }, function (tx,error) {
                alert(error.sourse+':'+error.message);
            });
        });

```

# 示例——利用本地数据库实现留言本#

利用本地数据库实现留言本
html文件

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>使用数据库实现Web留言本</title>
</head>
<body onload="note.init()">
<h1>使用数据库实现Web留言本</h1>
<table>
    <tr>
        <td>姓名：</td>
        <td>
            <input type="text" id="name">
        </td>
    </tr>
    <tr>
    <td>留言：</td>
    <td>
        <textarea id="memo" cols="30" rows="10"></textarea>
    </td>
</tr>
    <tr>
        <td>
            <input type="button" value="保存" onclick="note.saveData()"></textarea>
        </td>
    </tr>
</table>
<hr/>
<table id="datatable" border="1"></table>
</body>
<script src="sql_note.js"></script>
</html>
```
js文件

```
/**
 * Created by Administrator on 2016/5/10.
 */
var note= {
    datatable:null,
    db:openDatabase('MyData','','My DataBase',102400),
    init:function(){
        datatable=document.getElementById('datatable');
        this.showAllData();
    },
    removeAllData:function(){
        for(var i=datatable.childNodes.length-1;i>=0;i--){
            datatable.removeChild(datatable.childNodes[i]);
        }
        var tr=document.createElement('tr');
        var th1=document.createElement('th');
        var th2=document.createElement('th');
        var th3=document.createElement('th');
        th1.innerHTML='姓名';
        th2.innerHTML='留言';
        th3.innerHTML='时间';
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        datatable.appendChild(tr);
    },
    showData:function(row){
        var tr = document.createElement('tr');
        var td1=document.createElement('td');
        td1.innerHTML=row.name;
        var td2=document.createElement('td');
        td2.innerHTML=row.message;
        var td3=document.createElement('td');
        var t=new Date();
        t.setTime(row.time);
        td3.innerHTML= t.toLocaleDateString()+""+ t.toLocaleTimeString();
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        datatable.appendChild(tr);
    },
    showAllData:function(){
        this.db.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS MsgData(name TEXT, message TEXT,time INTEGER) ',[]);
            tx.executeSql('SELECT *FROM MsgData',[],function(tx,rs){
                note.removeAllData();//用this.removeAllData()不行
                console.log(rs);
                for(var i=0;i<rs.rows.length;i++){
                    note.showData(rs.rows[i]);
                }
            });
        });
    },
    addData:function(name,message,time){
        this.db.transaction(function(tx){
            tx.executeSql('INSERT INTO MsgData VALUES(?,?,?)',[name,message,time],function(tx,ts) {
                alert("成功保存数据！");
            }, function (tx,error) {
                alert(error.sourse+':'+error.message);
            });
        });
    },
    saveData:function(){
        var name=document.getElementById('name').value;
        var memo=document.getElementById('memo').value;
        var time=new Date().getTime();
        this.addData(name,memo,time);
        this.showAllData();
    }
};
```
实现效果如图：
![这里写图片描述](http://img.blog.csdn.net/20160510100711163)

# indexedDB数据库

详见我的另一篇博文http://blog.csdn.net/sinat_25127047/article/details/51381260