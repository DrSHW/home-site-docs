export const SITE = {
  title: "DrSHW的书架",
  description:
    "这里是DrSHW的书架，存放着学习工作之余写的一些教程和笔记，当然还有一些小项目。",
  defaultLanguage: "zh_CN",
};

export const OPEN_GRAPH = {
  image: {
    src: "https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true",
    alt:
      "astro logo on a starry expanse of space," +
      " with a purple saturn-like planet floating in the right foreground",
  },
  twitter: "astrodotbuild",
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: "ltr" | "rtl";
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  分类: "main",
  数据结构: "ds",
  计算机网络: "cn",
  组成原理: "co",
  操作系统: "os",
  前端小记: "fe",
  Python语法基础: "pb",
  Python网络编程: "pw",
  Python服务框架: "sf",
  Python科学计算: "ps",

} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/DrSHW/home-site-docs/tree/master`;

export const COMMUNITY_INVITE_URL = `https://github.com/maiqu-magicians`;

export const LICENCE_URL = `https://docs.drshw.tech/main/policy/`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "drshw",
  appId: "IYKF2PMF44",
  apiKey: "e9d34a5f4c277b87a5b040d6961e3d30",
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  main: {
    使用指南: [
      { text: "欢迎光临DrSHW的书架!", link: "main/introduction/" },
      { text: "动态", link: "main/changelog/" },
      { text: "贡献文章、勘误指南", link: "main/debugGuidance/" },
      { text: "隐私政策", link: "main/policy/" },
    ],
    一些小项目: [
      { text: "Lemon Compiler", link: "poj/Lemon/" },
      { text: "PC小程序解密逆向工具", link: "poj/PC_miniprogram_decrypter/" },
      { text: "魔塔(Tower of the Sorcerer) 小游戏", link: "poj/tos/" },
    ],
  },
  pb: {
    Python语法基础: [
      { text: "Python简介", link: "pb/introduction/" },
      { text: "变量、注释与用户交互", link: "pb/primary/01/" },
      {
        text: "变量的基本类型概述、变量的id与变量的删除",
        link: "pb/primary/02",
      },
      { text: "基本数据类型——字符串类型", link: "pb/primary/03/" },
      { text: "基本数据类型——数值类型、布尔类型与运算", link: "pb/primary/04/" },
      { text: "基本数据类型——列表", link: "pb/primary/05/" },
      { text: "基本数据类型——字典", link: "pb/primary/06/" },
      { text: "基本数据类型——元组、集合与类型转换", link: "pb/primary/07/" },
      { text: "控制流程", link: "pb/primary/08/" },
      { text: "函数初步", link: "pb/primary/09/" },
      { text: "函数高级", link: "pb/primary/10/" },
      { text: "字符编码与内存读写", link: "pb/primary/11/" },
      { text: "文件操作", link: "pb/primary/12/" },
      { text: "异常", link: "pb/primary/13/" },
    ],
    Python语法进阶: [
      { text: "面向对象基础", link: "pb/senior/1/" },
      { text: "封装、继承和多态", link: "pb/senior/2/" },
      { text: "面向对象高级", link: "pb/senior/3/" },
      { text: "模块", link: "pb/senior/4/" },
      { text: "迭代器与生成器", link: "pb/senior/5/" },
      { text: "多任务——线程", link: "pb/senior/6/" },
      { text: "多任务——进程", link: "pb/senior/7/" },
      { text: "多任务——协程", link: "pb/senior/8/" },
      { text: "Python 异步编程", link: "pb/senior/9/" },
      { text: "池与concurrent模块", link: "pb/senior/10/" },
    ],
    番外篇: [
      { text: "番外——Python中的类型标注", link: "pb/extra_1/" },
      { text: "番外——内存管理与垃圾回收", link: "pb/extra_2/" },
    ],
  },
  pw: {
    Python网络爬虫: [
      { text: "说在前面", link: "pw/introduction/" },
      { text: "网络——UDP", link: "pw/spider/01/" },
      { text: "网络——TCP", link: "pw/spider/02/" },
      { text: "网络爬虫通讯原理", link: "pw/spider/03/" },
      { text: "获取网站信息——httpx和request", link: "pw/spider/04/" },
      { text: "多种方式数据解析", link: "pw/spider/05/" },
      { text: "多种方式数据存储", link: "pw/spider/06/" },
      { text: "基于进程线程协程的爬虫提速", link: "pw/spider/07/" },
      { text: "seleium自动化工具的使用", link: "pw/spider/08/" },
      { text: "Charles抓包工具的使用", link: "pw/spider/09/" },
      { text: "Cookie反爬", link: "pw/spider/10/" },
      { text: "文本混淆", link: "pw/spider/11/" },
      { text: "验证码反爬初步", link: "pw/spider/12/" },
    ],
    JS逆向专题: [
      { text: "说在前面", link: "pw/js_decryption/00/" },
      { text: "JavaScript爬虫入门", link: "pw/js_decryption/01/" },
      { text: "消息摘要签名算法", link: "pw/js_decryption/02/" },
      { text: "对称加密算法", link: "pw/js_decryption/03/" },
      { text: "非对称加密算法", link: "pw/js_decryption/04/" },
      { text: "Webpack破解", link: "pw/js_decryption/05/" },
      { text: "JavaScript混淆技术", link: "pw/js_decryption/06/" },
      { text: "JS-RPC", link: "pw/js_decryption/07/" },
    ],
    爬虫框架专题: [
      { text: "scrapy框架入门", link: "pw/structures/01/" },
      { text: "scrapy框架进阶", link: "pw/structures/02/" },
      { text: "scrapy-redis分布式", link: "pw/structures/03/" },
      { text: "feapder框架入门", link: "pw/structures/04/" },
    ],
    番外篇: [
      {
        text: "番外——TCP三次握手与四次挥手，你想知道的都在这",
        link: "pw/extra_1",
      },
      { text: "番外——Redis的使用", link: "pw/extra_2/" },
    ],
  },
  sf: {
    Django基础: [
      { text: "说在前面", link: "sf/introduction/" },
      { text: "初识 Django", link: "sf/1/1/" },
      { text: "Django 流程", link: "sf/1/2/" },
      { text: "Django 模型", link: "sf/1/3/" },
      { text: "Django 视图", link: "sf/1/4/" },
    ],
    进阶篇: [
      { text: "说在前面", link: "sf/2/1/" },
      { text: "内置用户模型类、接口规范与跨域", link: "sf/2/2/" },
      { text: "各种验证码的实现", link: "sf/2/3/" },
    ],
    番外篇: [
      { text: "同源策略、跨域解决方案", link: "sf/extra_1/" },
      { text: "通过CSRF中间件验证", link: "sf/extra_2/" },
    ],
  },
  ps: {
    Python数据分析: [
      { text: "科学计算库numpy", link: "ps/data_analysis/01/" },
      { text: "数据分析工具pandas与其基本使用", link: "ps/data_analysis/02/" },
      { text: "pandas数据预处理", link: "ps/data_analysis/03/" },
      { text: "pandas数据聚合与分组运算", link: "ps/data_analysis/04/" },
      { text: "pandas时间序列", link: "ps/data_analysis/05/" },
      { text: "数据可视化matplotlib", link: "ps/data_analysis/06/" },
    ],
    Python机器学习: [
      { text: "机器学习简介", link: "ps/introduction/" },
      {
        text: "线性回归介绍与单变量线性回归模型",
        link: "ps/machine_learning/01",
      },
    ],
    计算机视觉入门: [
      { text: "计算机视觉概述", link: "ps/cv/1/" },
      {
        text: "深度学习与神经网络",
        link: "ps/cv/2/",
      },
      {
        text: "Open-CV图像处理指南",
        link: "ps/cv/3/",
      },
    ],
  },
  cn: {
    "第一章 计算机网络体系结构": [
      { text: "1.1 计算机网络概述", link: "cn/1/1/" },
      { text: "1.2 计算机网络体系结构与参考模型", link: "cn/1/2/" },
    ],
    "第二章 物理层": [
      { text: "2.1 通信基础", link: "cn/2/1/" },
      { text: "2.2 传输介质", link: "cn/2/2/" },
      { text: "2.3 物理层设备", link: "cn/2/3/" },
    ],
    "第三章 数据链路层": [
      { text: "3.1 数据链路层的功能", link: "cn/3/1/" },
      { text: "3.2 组帧", link: "cn/3/2/" },
      { text: "3.3 差错控制", link: "cn/3/3/" },
      { text: "3.4 流量控制与可靠传输机制", link: "cn/3/4/" },
      { text: "3.5 介质访问控制", link: "cn/3/5/" },
      { text: "3.6 局域网", link: "cn/3/6/" },
      { text: "3.7 广域网", link: "cn/3/7/" },
      { text: "3.8 数据链路层设备", link: "cn/3/8/" },
    ],
    "第四章 网络层": [
      { text: "4.1 网络层的功能", link: "cn/4/1/" },
      { text: "4.2 路由算法", link: "cn/4/2/" },
      { text: "4.3 IPv4", link: "cn/4/3/" },
      { text: "4.4 IPv6", link: "cn/4/4/" },
      { text: "4.5 路由协议", link: "cn/4/5/" },
      { text: "4.6 IP组播", link: "cn/4/6/" },
      { text: "4.7 移动IP", link: "cn/4/7/" },
      { text: "4.8 网络层设备", link: "cn/4/8/" },
    ],
    "第五章 传输层": [
      { text: "5.1 传输层提供的服务", link: "cn/5/1/" },
      { text: "5.2 UDP协议", link: "cn/5/2/" },
      { text: "5.3 TCP协议", link: "cn/5/3/" },
    ],
    "第六章 应用层": [
      { text: "6.1 网络应用模型", link: "cn/6/1/" },
      { text: "6.2 域名系统 DNS", link: "cn/6/2/" },
      { text: "6.3 文件传输协议 FTP", link: "cn/6/3/" },
      { text: "6.4 电子邮件", link: "cn/6/4/" },
      { text: "6.5 万维网 WWW", link: "cn/6/5/" },
    ],
  },
  co: {
    "第一章 计算机系统概述": [
      { text: "1.1 计算机发展历程", link: "co/1/1/" },
      { text: "1.2 计算机系统层次结构", link: "co/1/2/" },
      { text: "1.3 计算机的性能指标", link: "co/1/3/" },
    ],
    "第二章 数据的表示和运算": [
      { text: "2.1 数制和编码", link: "co/2/1/" },
      { text: "2.2 运算方法和运算电路", link: "co/2/2/" },
      { text: "2.3 浮点数的表示和运算", link: "co/2/3/" },
    ],
    "第三章 存储系统": [
      { text: "3.1 存储器概述", link: "co/3/1/" },
      { text: "3.2 主存储器", link: "co/3/2/" },
      { text: "3.3 主存储器与CPU的连接", link: "co/3/3/" },
      { text: "3.4 外部存储器", link: "co/3/4/" },
      { text: "3.5 高速缓冲存储器", link: "co/3/5/" },
      { text: "3.6 虚拟存储器", link: "co/3/6/" },
    ],
    "第四章 指令系统": [
      { text: "4.1 指令系统概述", link: "co/4/1/" },
      { text: "4.2 指令的寻址方式", link: "co/4/2/" },
      { text: "4.3 程序的机器级代码表示", link: "co/4/3/" },
      { text: "4.4 CISC和RISC的比较", link: "co/4/4/" },
    ],
    "第五章 中央处理器": [
      { text: "5.1 CPU的功能和基本结构", link: "co/5/1/" },
      { text: "5.2 指令执行过程", link: "co/5/2/" },
      { text: "5.3 数据通路的功能和基本结构", link: "co/5/3/" },
      { text: "5.4 控制器的功能和工作原理", link: "co/5/4/" },
      { text: "5.5 异常和中断机制", link: "co/5/5/" },
      { text: "5.6 指令流水线", link: "co/5/6/" },
      { text: "5.7 多处理器的基本概念", link: "co/5/7/" },
    ],
    "第六章 总线": [
      { text: "6.1 总线概述", link: "co/6/1/" },
      { text: "6.2 总线事务和定时", link: "co/6/2/" },
    ],
    "第七章 输入输出系统": [
      { text: "7.1 I/O系统的基本概念", link: "co/7/1/" },
      { text: "7.2 I/O接口", link: "co/7/2/" },
      { text: "7.3 I/O方式", link: "co/7/3/" },
    ],
  },
  ds: {
    "第一章 数据结构引论": [
      { text: "1.1 数据结构的基本概念", link: "ds/1/1/" },
      { text: "1.2 算法和算法评价", link: "ds/1/2/" },
    ],
    "第二章 线性表": [
      { text: "2.1 线性表的定义和基本操作", link: "ds/2/1/" },
      { text: "2.2 线性表的顺序表示", link: "ds/2/2/" },
      { text: "2.3 线性表的链式表示", link: "ds/2/3/" },
    ],
    "第三章 栈、队列和数组": [
      { text: "3.1 栈", link: "ds/3/1/" },
      { text: "3.2 队列", link: "ds/3/2/" },
      { text: "3.3 栈和队列的应用", link: "ds/3/3/" },
      { text: "3.4 数组和特殊矩阵", link: "ds/3/4/" },
    ],
    "第四章 串": [
      { text: "4.1 串的定义和实现", link: "ds/4/1/" },
      { text: "4.2 串的模式匹配", link: "ds/4/2/" },
    ],
    "第五章 树和二叉树": [
      { text: "5.1 树的基本概念", link: "ds/5/1/" },
      { text: "5.2 二叉树的概念", link: "ds/5/2/" },
      { text: "5.3 树的遍历与线索二叉树", link: "ds/5/3/" },
      { text: "5.4 树和森林", link: "ds/5/4/" },
      { text: "5.5 哈夫曼树与哈夫曼编码", link: "ds/5/5/" },
      { text: "5.6 并查集", link: "ds/5/6/" },
    ],
    "第六章 图": [
      { text: "6.1 图的基本概念", link: "ds/6/1/" },
      { text: "6.2 图的存储结构及基本操作", link: "ds/6/2/" },
      { text: "6.3 图的遍历", link: "ds/6/3/" },
      { text: "6.4 最小生成树", link: "ds/6/4/" },
      { text: "6.5 最短路径与关键路径", link: "ds/6/5/" },
      { text: "6.6 拓扑排序", link: "ds/6/6/" },
      { text: "6.7 二分图和匈牙利算法", link: "ds/6/7/" },
    ],
    "第七章 查找": [
      { text: "7.1 查找的基本概念", link: "ds/7/1/" },
      { text: "7.2 二叉排序树", link: "ds/7/2/" },
      { text: "7.3 平衡二叉树", link: "ds/7/3/" },
      { text: "7.4 线段树", link: "ds/7/4/" },
      { text: "7.5 B树和B+树", link: "ds/7/5/" },
      { text: "7.6 散列表", link: "ds/7/6/" },
    ],
    "第八章 排序": [
      { text: "8.1 排序的基本概念", link: "ds/8/1/" },
      { text: "8.2 内部排序算法及性能对比", link: "ds/8/2/" },
      { text: "8.3 外部排序", link: "ds/8/3/" },
    ],
  },
  os: {
    "第一章 操作系统引论": [
      { text: "1.1 操作系统的概念，功能和目标", link: "os/introduction/" },
      { text: "1.2 操作系统的特征", link: "os/1/2/" },
      { text: "1.3 操作系统的发展和分类", link: "os/1/3/" },
      { text: "1.4 操作系统运行机制和体系结构", link: "os/1/4/" },
      { text: "1.5 中断和异常", link: "os/1/5/" },
      { text: "1.6 系统调用", link: "os/1/6/" },
      { text: "本章疑难点", link: "os/1/final/" },
    ],
    "第二章 进程的描述与控制": [
      { text: "2.1 进程的基本概念", link: "os/2/1/" },
      { text: "2.2 进程控制", link: "os/2/2/" },
      { text: "2.3 进程同步", link: "os/2/3/" },
      { text: "2.4 经典的进程同步问题", link: "os/2/4/" },
      { text: "2.5 管程机制", link: "os/2/5/" },
      { text: "2.6 进程通信", link: "os/2/6/" },
      { text: "2.7 线程的基本概念与实现", link: "os/2/7/" },
      { text: "本章疑难点", link: "os/2/final/" },
    ],
    "第三章 处理机调度与死锁": [
      { text: "3.1 处理机调度的基本概念", link: "os/3/1/" },
      { text: "3.2 调度算法", link: "os/3/2/" },
      { text: "3.3 死锁的基本概念 ", link: "os/3/3/" },
      { text: "3.4 预防死锁", link: "os/3/4/" },
      { text: "3.5 避免死锁", link: "os/3/5/" },
      { text: "3.6 死锁的检测和解除", link: "os/3/6/" },
      { text: "本章疑难点", link: "os/3/final/" },
    ],
    "第四章 存储器管理": [
      { text: "4.1 存储器管理的基本概念", link: "os/4/1/" },
      { text: "4.2 连续分配方式", link: "os/4/2/" },
      { text: "4.3 基本分页存储管理方式", link: "os/4/3/" },
      { text: "4.4 基本分段存储管理方式", link: "os/4/4/" },
      { text: "本章疑难点", link: "os/4/final/" },
    ],
    "第五章 虚拟存储器": [
      { text: "5.1 虚拟存储器的基本概念", link: "os/5/1/" },
      { text: "5.2 请求分页存储管理方式", link: "os/5/2/" },
      { text: "5.3 置换算法", link: "os/5/3/" },
      { text: "5.4 页面分配策略", link: "os/5/4/" },
      { text: "本章疑难点", link: "os/5/final/" },
    ],
    "第六章 输入输出系统": [
      { text: "6.1 I/O设备的概念和分类", link: "os/6/1/" },
      { text: "6.2 I/O控制器", link: "os/6/2/" },
      { text: "6.3 I/O控制方式", link: "os/6/3/" },
      { text: "6.4 I/O软件层次结构", link: "os/6/4/" },
      { text: "6.5 假脱机技术", link: "os/6/5/" },
      { text: "6.6 设备的分类与回收", link: "os/6/6/" },
      { text: "6.7 缓冲区管理", link: "os/6/7/" },
      { text: "本章疑难点", link: "os/6/final/" },
    ],
    "第七章 文件管理": [
      { text: "7.1 文件和文件系统", link: "os/7/1/" },
      { text: "7.2 文件的逻辑结构", link: "os/7/2/" },
      { text: "7.3 文件目录", link: "os/7/3/" },
      { text: "7.4 文件的基本操作", link: "os/7/4/" },
      { text: "7.5 文件共享", link: "os/7/5/" },
      { text: "7.6 文件保护", link: "os/7/6/" },
      { text: "本章疑难点", link: "os/7/final/" },
    ],
    "第八章 磁盘管理": [
      { text: "8.1 外存的组织方式", link: "os/8/1/" },
      { text: "8.2 文件存储空间的管理", link: "os/8/2/" },
      { text: "8.3 磁盘结构与磁盘调度算法", link: "os/8/3/" },
      { text: "8.4 减少磁盘延迟时间的方法", link: "os/8/4/" },
      { text: "8.5 磁盘的管理", link: "os/8/5/" },
      { text: "本章疑难点", link: "os/8/final/" },
    ],
  },
  fe: {
    "浏览器篇": [
      { text: "浏览器和前端，从哪里来？", link: "fe/1/1/" },
      { text: "浏览器架构与事件循环", link: "fe/1/2/" },
      { text: "渲染引擎的执行原理", link: "fe/1/3/" },
    ],
  },
};
