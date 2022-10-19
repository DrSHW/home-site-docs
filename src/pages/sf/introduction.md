---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

## 说在前面

### 前缀知识

+ [**Python基本语法**](https://docs.drshw.tech/pb/introduction/)
+ 一点点**服务器运维**的知识；
+ [**Python网络编程**](https://docs.drshw.tech/pw/introduction/)中关于请求和响应的相关知识；
+ 熟悉数据库[MySQL](https://docs.drshw.tech/pw/spider/06/#%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AD%98%E5%82%A8)的[Redis](https://docs.drshw.tech/pw/extra_2/)的概念和使用；
+ 前端的知识，三板斧与`Vue`框架。

### 栏目介绍

在本栏目中，我们将介绍主流Python框架（`Django`、`Flask`）的使用与Golang分布式的搭建（和一些实战案例？）。

不定期更新。

### 本教程使用的开发环境

+ 为了便于服务的迁移，服务端项目均在Ubuntu Server中的`docker`容器中运行，其中Python版本为3.9；
+ 当然，也可以使用虚拟环境`venv`直接在服务器中搭建；
+ 需要安装MySQL和Redis服务（配置就不讲解了）；
+ 使用PyCharm2022专业版远程连接远程解释器。

下面给出两种环境搭建的方式：

#### 使用docker容器

首先需要安装`docker`，接着依次执行：

```bash
docker pull ubuntu:20.04	# 拉取ubuntu20.04镜像

docker tag ubuntu:20.04 django_config	# 重命名镜像

docker run -p 20000:22 -p 8000:8000 --name django_server -itd django_config	# 创建并运行镜像，端口在服务器安全组（防火墙）中开放

docker attach django_server	# 进入创建的docker容器

passwd # 设置root密码

apt update

apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common # 换源，下载基本命令

sudo apt-get sudo, vim, openssh-server

sudo service ssh start	# 启动ssh服务

sudo ps -e | grep ssh	# 检查服务是否开启

# 配置ssh，生成公私钥之类的，这里不讲了

sudo apt-get python3.10

echo alias python=python3 >> ~/.bashrc

source ~/.bashrc

ctrl p + ctrl q # 挂起容器
```

即可配置完成。

#### 使用虚拟环境

安装虚拟环境的指令：

```bash
sudo pip install virtualenv
sudo pip install virtualenvwrapper
```

> 安装完虚拟环境后，如果提示找不到`mkvirtualenv`命令，须配置环境变量：
>
> ```bash
> # 1、创建目录用来存放虚拟环境
> mkdir $HOME/.virtualenvs
> 
> # 2、打开~/.bashrc文件，并添加如下：
> export WORKON_HOME=$HOME/.virtualenvs
> source /usr/local/bin/virtualenvwrapper.sh
> 
> # 3、运行
> source ~/.bashrc
> ```

创建虚拟环境：

- 提示：如果不指定Python版本，默认安装的是Python2的虚拟环境；

- 在Python2中，创建虚拟环境：

  ```bash
  mkvirtualenv 虚拟环境名称
  # 例：创建py2_django的虚拟环境
  # mkvirtualenv py_django
  ```

- 在Python3中，创建虚拟环境：

  ```bash
  mkvirtualenv -p python3 虚拟环境名称
  # 例：创建py3_django的虚拟环境
  # mkvirtualenv -p python3 py3_django
  ```

创建成功后，终端会自动工作在这个虚拟环境上，此时提示符最前面会出现“虚拟环境名称”，例如：

![img](https://images.drshw.tech/images/notes/03D138F66975E366CFBA9E89530E91C4.png)

查看/进入虚拟环境的命令：

```bash
workon 虚拟环境名称
# 例：使用py3_django的虚拟环境
# workon py3_django
```

退出虚拟环境的命令：

```bash
deactivate
```

删除虚拟环境的命令：

```bash
rmvirtualenv 虚拟环境名称
# 例 ：删除虚拟环境py3_django
# 先退出：deactivate
# 再删除：rmvirtualenv py3_django
```

#### 使用PyCharm远程连接

**前提是使用PyCharm专业版，且服务器可被SSH连接。**

首先选择解释器：

<img src="https://images.drshw.tech/images/notes/image-20221017235556851.png" alt="image-20221017235556851" style="zoom:50%;" />

移到添加新的解释器，选中`SSH...`：

![image-20221018000112066](https://images.drshw.tech/images/notes/image-20221018000112066.png)

填入IP、密码、端口等信息，不断点击下一步：

<img src="https://images.drshw.tech/images/notes/image-20221018000242928.png" alt="image-20221018000242928" style="zoom: 35%;" />

使用`docker`则选择系统解释器，使用虚拟环境则选择`Virtualenv`环境，解释器选择对应的远程解释器，同步文件夹选择本地需要同步至云上的文件夹即可：

<img src="https://images.drshw.tech/images/notes/image-20221019224425859.png" alt="image-20221019224425859" style="zoom:30%;" />

<img src="https://images.drshw.tech/images/notes/image-20221019225729156.png" alt="image-20221019225729156" style="zoom:30%;" />

点击创建后，配置完毕。