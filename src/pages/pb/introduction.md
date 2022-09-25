---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

# Python简介

## 为什么要用Python

使用任何编程语言来开发程序，都是为了让计算机干活，比如下载一个MP3，编写一个文档等，而计算机干活的CPU只认识机器指令，所以，尽管不同的编程语言差异极大，最后都得“翻译”成CPU可以执行的机器指令。而不同的编程语言，干同一个活，编写的代码量，差距也很大。

比如，完成同一个任务，C语言要写1000行代码，Java只需要写100行，而Python可能只要**20**行。

由此就能看出，Python是一种相当简洁而高效的语言。

## Python语言的其他优点

1. 语法简单明了。第一门语言，其实就是语法+Flow control（控制），而Python的语法简单，代码可读性高，容易入门。

2. Python的哲学是「做一件事情应该只有一种最好的方法」，对于初学者规范自己的学习有很大的帮助，同时也帮助初学者能够读懂其他人的代码。

3. 养成良好的习惯。Python对于代码的要求严谨，特别是缩进（Indentation），对于初学者养成良好的代码习惯很有帮助。

4. Python的语法设计非常优秀，思想也比较现代，可以更快的理解现代编程语言的一些思想。

5. Python中一切皆对象，仍然是传统基于Class的面向对象语言，和Java、C#、Ruby一样，比较大众。从Python去学Design Pattern也是比较合适的。

6. Python的内置数据结构清晰好用(类似C++中的STL)，优秀的代码很多。

7. Python在其他领域，比如科学计算等等有广泛的运用，对于学一门语言作为工具来说，Python很合适。

## Python语法的主要特点

+ 解释型语言，且末尾无需分号标注结束；

+ 通过缩进(`Tab`)实现作用域判定，例如：

  ```python
  if True:
      print ("True")
  else:
      print ("False")
  ```

  这样写是正确的，而如果缩进不一致：

  ```python
  if True:
      print ("True")
  else:
     print ("False")
  ```

  程序将报错。

+ 支持多行语句：

  Python 通常是一行写完一条语句，但如果语句很长，我们可以使用反斜杠`\`来实现多行语句，例如：

  ```python
  total = item_one + \
          item_two + \
          item_three
  ```

  在`[]`,  `{}`, 或`()`中的多行语句，不需要使用反斜杠`\`，例如：

  ```python
  total = ['item_one', 'item_two', 'item_three',
          'item_four', 'item_five']
  ```

## 环境配置

本教程使用的Python版本为Python3.7, 使用PyCharm作为IDE。在这个部分，Python的版本不是很重要，Python3.0+即可，能跑就行。

本教程将分为多个部分，帮助大家循序渐进地从0到1了解Python这门神奇的语言。

下面，我们开始Python语法基础的学习。