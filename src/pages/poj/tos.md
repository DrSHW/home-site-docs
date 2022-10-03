---
description: Docs intro
layout: ../../layouts/MainLayout.astro 
---

## 魔塔(Tower of the Sorcerer) 小游戏

项目地址：https://gitlab.dustella.net/drsyw/tower-of-the-sorcerer 。

#### 为什么是魔塔

本人几年前曾接触过这款游戏，但由于其难度很大，并未真正意义的通关过。

但这款游戏让我印象颇深，于是就有了复刻的念头。

整个游戏由C++编写而成，由于Qt GUI框架过于臃肿，故舍弃之，尝试使用EasyX的graphics.h库用作GUI。（结果其实差不多）

#### 配置方法：

* 首先你需要准备VS 2022
* 其次运行目录下的EasyX_20220610.exe文件，安装时选择安装至Visual C++ 2022，如下图所示：

![image](Source/readme1.png)

即可完成配置

#### 启动方式

* 直接运行Magic_tower.sln文件，即可进入VS 2022
* 进入项目后，点击本地windows调试器即可

  ![image.png](Source/readme2.png)

#### 游戏方式

传统的wsad控制上下左右移动，一些特殊的按键会随着游玩过程添加。

详见wiki魔塔游戏的一些相关机制：https://zh.wikipedia.org/zh-hk/%E9%AD%94%E5%A1%94%E6%B8%B8%E6%88%8F

此版本为50层魔塔的复刻版本，但对其做了一些修改，以及多结局设定。

由于制作时间有限，仅能实现完整的游戏内容（包括地图，对话），界面的优化，功能的封装以及按键控制做的并不够好。

可以通过修改源文件Magic_tower.cpp，修改一些游戏参数。注释很全，通过注释可了解一些参数的意义从而进行修改。

目前还未开发存档功能。

### BGM有些阴间（用的原版），推荐关掉声音启动游戏！！！
