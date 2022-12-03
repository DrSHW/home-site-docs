---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

# 同源策略、跨域解决方案

## 同源策略

### 什么是源

源（origin）就是协议、域名和端口号。

若地址里面的**协议、域名和端口号均相同**则属于同源。

以下是相对于 `http://www.a.com/test/index.html` 的同源检测：

+ `http://www.a.com/dir/page.html` ----成功
+ `http://www.child.a.com/test/index.html` ----失败，域名不同
+ `https://www.a.com/test/index.html` ----失败，协议不同
+ `http://www.a.com:8080/test/index.html` ----失败，端口号不同

### 同源策略

**同源策略是浏览器的一个安全功能**，不同源的客户端脚本在**没有明确授权**的情况下，不能读写对方资源。所以a.com下的js脚本采用ajax读取b.com里面的文件数据是会报错的。

不受同源策略限制的：

1. 页面中的链接，重定向以及表单提交是不会受到同源策略限制的。
2. 跨域资源的引入是可以的。但是JS不能读写加载的内容。如嵌入到页面中的`<script src="..."></script>，<img>，<link>，<iframe>`等。

## 跨域

### 跨域的概念

受前面所讲的浏览器同源策略的影响，不是同源的脚本不能操作其他源下面的对象。想要操作另一个源下的对象是就**需要跨域**。

### 跨域的实现形式

即设置`document.domain`。

比如`home.example.com`要读取`developer.example.com`里面的文档，由于同源策略的限制，就无法读取，我们通过设置`document.domain="example.com"`，这时就不再受同源策略的限制了。

### 跨资源共享CORS（Cross-origin resource sharing）

 `CORS`采用新的`Origin`请求头和新的`Access-Control-Allow-Origin`响应头来扩展HTTP。它**允许服务器用头信息显示地列出源**，或使用**通配符来匹配所有的源**并允许任何地址请求文件。

因此，**实现CORS通信的关键是服务器**。只要服务器实现了CORS接口，就可以跨源通信。

从而它允许浏览器向跨源服务器，发出XMLHttpRequest请求，克服了AJAX只能同源使用的限制。

### 跨文档消息（cross-document messaging）

允许来自一个文档的脚本可以传递消息到另一个文档里的脚本，而不管脚本的来源是否不同，通过调用`window.postMessage()`方法，可以异步传递消息事件(可以使用`onmessage`事件处理程序函数来处理它)到窗口的文档里。

 

 