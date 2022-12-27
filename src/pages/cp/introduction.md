---
description: 前端小记
layout: ../../layouts/MainLayout.astro
---

## 浏览器和前端，从哪里来？

### 1990年——世界上的第一个网页诞生

**蒂姆·伯纳斯·李**（TimBerners-Lee）希望全世界的科学家共享他们的一些资料，于是他构想并实现了`WWW`（World Wide Web，万维网），即最初的网页。

> 蒂姆的照片：
>
> <img src="https://images.drshw.tech/images/notes/god.jpg"/>

最早的网页只能在操作系统的终端中浏览，即只能使用命令行操作，网页都是在字符窗口中显示，这当然极不方便。后来，蒂姆使用C语言移植了`WWW`，叫做`libwww`，这是第一个真正意义上只允许他人浏览网站的浏览器。

> “第一个网页”的预览网址：[http://info.cern.ch/hypertext/WWW/TheProject.html]()，下图即为预览界面图，可见其仅由文本和“超链接”组成。
>
> ![image-20221227163059909](https://images.drshw.tech/images/notes/image-20221227163059909.png)

为了能让网页能被所有人看到，蒂姆博士需要做到实现**文本的传输和接收**。这也需要**规定一种统一的，便于解析的文本格式**。同样的，还需要将文本**在网页上解析并显示出来**。蒂姆博士发明了三样东西，用于处理上述问题。

在聊三样东西之前，我们需要了解**超文本**（Hypertext）的概念，它和普通的文本有三个区别：

<img src="https://handwiki.org/wiki/images/thumb/4/41/Sistema_hipertextual.jpg/250px-Sistema_hipertextual.jpg" alt="img" style="zoom:200%;" />

1. 文本之间可以通过某种连接联系起来：

   如上图所示，从Home页可通过链接，跳转至其他页面，即“超链接”；

2. 文本要有确切的格式，以便于被“软件”（其实就是浏览器）解析；

3. 除了文字外可以显示一些诸如媒体和图片的东西。

蒂姆博士发明的第一样东西，就是**一种超文本的实现，HTML**（Hyper Text Markup Language）。

为了实现超文本的传输，蒂姆博士发明了第二样东西——**HTTP协议**（Hyper Text Transport Protocol）。

为了实现超文本的显示，蒂姆博士发明了第三样东西——**可渲染HTML的引擎**，即现在所说的**浏览器**（Broswer），它有以下两大功能：

1. 根据HTML的规则，解析并生成像素点信息，并告诉显卡；
2. 显卡驱动显示器，使用户看到图像。

### 1993年——不仅文字，图片登场，浏览器破圈

马克在IBM工作时，了解了WWW，并与另一位NCSA的成员朋友吉姆克拉克研发了**MOSIAC浏览器**，其中的渲染引擎支持了**图片渲染**。

> 马克·安德里森的照片与第一款图形化的浏览器MOSIAC：
>
> <img src="https://images.drshw.tech/images/notes/OIP-C.8aLqUIBn6ysc-yIY7e9pwgAAAA" alt="马克·安德里森" style="zoom:150%;" /><img src="https://tse1-mm.cn.bing.net/th/id/OIP-C.Z6Eo2uEZ02h0ATkwPAMWcgHaFQ?w=247&h=180&c=7&r=0&o=5&pid=1.7" alt="mosiac browser 的图像结果" style="zoom:150%;" />

1994年后，他们俩从NCSA离职，成立了Netscape网景公司。而MOSAIC浏览器的版权在原公司NCSA手中，于是他们在MOSAIC的基础上开发了一个**Netscape Navigator浏览器**。在2003年前，它都是主流的浏览器。

### 1996年——微软加入浏览器市场，脚本正式登台

Netscape 公司很快发现，浏览器需要一种可以嵌入网页的脚本语言，用来控制浏览器行为。当时，网速很慢而且上网费很贵，有些操作不宜在服务器端完成。比如，如果用户忘记填写“用户名”，就点了“发送”按钮，到服务器再发现这一点就有点太晚了，最好能在用户发出数据之前，就告诉用户“请填写用户名”。这就需要在网页中嵌入小程序，让浏览器检查每一栏是否都填写了。

于是，1995年5月，网景公司的一名程序员Brendan Eich，在Netscape Navigator内核的基础上开发了livescript：

> 1995年，Netscape公司雇佣了程序员Brendan Eich开发这种网页脚本语言。Brendan Eich有很强的函数式编程背景，希望以Scheme语言(函数式语言鼻祖LISP语言的一种方言)为蓝本，实现这种新语言。
>
> 1995年5月，Brendan Eich只用了**10天**，就设计完成了这种语言的第一版。它是一个大杂烩，语法有多个来源：
>
> + 基本语法：借鉴C语言和Java语言。
> + 数据结构：借鉴Java语言，包括将值分成原始值和对象两大类
> + 函数的用法：借鉴Scheme语言和Awk语言，将函数当作第一等公民，并引入闭包原型继承模型:借鉴Self语言 (Smalltalk的一种变种)。
> + 正则表达式：借鉴Perl语言。
> + 字符串和数组处理：借鉴Python语言。
>
> ![查看源图像](https://images.drshw.tech/images/notes/livescript-in-editor.png)
>
> 为了保持简单，这种脚本语言**缺少一些关键的功能**，比如块级作用域、模块、子类型(subtyping) 等等，但是可以利用现有功能找出解决办法。这种功能的不足，直接导致了后来JavaScript的一个显著特点：对于其他语言，你需要学习语言的各种功能，而对于JavaScript，你常常需要学习**各种解决问题的模式**。而且由于来源多样，从一开始就注定，JavaScript的编程风格是函数式编程和面向对象编程的一种混合体。

后来由于Netscape公司和Sun公司（Java语言的发明者与所有者）达成协议，后者允许将这种语言叫做**JavaScript**。这样一来，Netscape公司可以借助Java语言的声势，而Sun公司则将自己的影响力扩展到了浏览器。

1996年3月，Navigator 2.0 浏览器**正式内置了JavaScript脚本语言**（嵌入了解释器）。但由于那时脚本的功能并不多，脚本最多只是做一些很简单的交互，如表单验证。所以并没有单独的脚本解析引擎，而是在原有的渲染引擎中加了点代码去解析脚本。

马克等人离职不久，NCSA就把MOSIAC的版权卖给了spy class公司。后来，**微软**收购了spy class公司，获得了MOSAIC的版权。微软公司对MOSAIC浏览器进行了包装和改进，正式发布了**IE Internet Explorer 1.0**，即我们熟知的IE浏览器。于是，微软与网景公司的浏览器大战一触即发。

![ie vs netscape 的图像结果](https://tse3-mm.cn.bing.net/th/id/OIP-C.Eny4dllpwcL58YuaAIzjiQHaFS?w=252&h=180&c=7&r=0&o=5&pid=1.7)

1996年8月，微软模仿JavaScript开发了一种相近的语言，取名为JScript。1996年11月，网景公司为了让JavaScript影响力更大，决定将其提交给**国际标准化组织ECMA**（European Computer Manufacturers Association），希望JavaScript能够成为国际标准，以此抵抗微软。ECMA的39号技术委员会（Technical Committee 39）负责制定和审核这一标准，成员由业内的大公司派出的工程师组成。

### 2001年——IE6发布，初代神登场

在2001年，随着微软发布WindowsXP操作系统，也正式发布了**IE Internet Explorer 6.0**版本。在该版本中，**JS解析引擎被抽离了出来**。

![See the source image](https://ts1.cn.mm.bing.net/th/id/R-C.f3d698a1642dc3d6fc104875999c9316?rik=N5wdcFn7RikPLg&riu=http%3a%2f%2fwww.betaarchive.com%2fimageupload%2f2014-01%2f1389982566.or.42872.png&ehk=A%2fwaVC1hxVObmGYuFC1K%2f%2fX%2fDSl7lHTObpVpJmkohxY%3d&risl=&pid=ImgRaw&r=0)

2003年，Netscape Navigator不敌IE6，开源了内核代码并退出历史舞台。现在Mozilla公司的FireFox浏览器很大一部分都是基于Netscape Navigator开发的。

### 2008年——划时代！谷歌浏览器横空出世

2008年，于人类而言发生了两件大事，即举行北京奥运会和**谷歌浏览器出世**。谷歌浏览器和Safari共同研制了**webkit内核**，后来谷歌在webkit内核的基础上，改名为**blink内核**，也就是现在使用的内核。

![Image result for V8 JavaScript engine ](https://images.drshw.tech/images/notes/OIP-C.pGq38PpiCZKWcczKjpMe9gHaCH)

谷歌浏览器之所以是划时代的、最快的浏览器，因为其研制了**v8引擎**作为JS引擎，它有两大特点：

1. 可以**直接将代码转为机器码**，跳过字节码，效率非常高；
2. 可以**独立于浏览器运行**（Node.js运行环境），有了这个条件才有了各种各样的框架，才有了现在的前端。

![Image result for V8 JavaScript engine ](https://images.drshw.tech/images/notes/OIP-C.Vc1mVuNRMJwmAnXjSrrUJgHaFV)

于是，浏览器世界大战终于告一段落，被**谷歌**之神统治。前端也因为v8引擎，有了**质的飞跃**，前端工程师前所未有地开始稀缺。后来，甲骨文Oracle公司收购了Sun公司，即JavaScript的版权现属于甲骨文公司。

现在的JavaScript，已经是一门较为成熟且灵活的语言，且根据**运行环境**，会以对象的形式注入不同的API以供调用。例如在浏览器中运行时，可以操作DOM、BOM对象，而在Node.js环境中，可以作为服务端操作文件与请求等。

我们也常常听说ES6（ECMAScript）等名词，它其实只是用于标准化JavaScript的基本词法、语法结构（lexical）的一个标准，是由W3C（World Wide Web Consortium）组织制定的。
