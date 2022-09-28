---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---


# Redis数据库的使用

（配合框架讲解中的**`scrapy-redis`分布式**一节食用，风味更佳）

Python `redis`官方文档：https://redis-py.readthedocs.io/en/latest/#indices-and-tables ；

Redis命令参考：http://doc.redisfans.com/ ；

## Redis数据库的安装

见[**`scrapy-redis`分布式**](https://docs.drshw.tech/pw/structures/03/)一节，这里不讲了。

## 基本客户端指令

+ 运行测试命令

  ```sql
  ping
  ```

  若响应为`PONG`，则为连接成功，可以正常使用数据库；否则无法操作数据库，需要根据报错信息判断问题所在：

  <img src="https://images.drshw.tech/images/notes/image-20220927220929561.png" alt="image-20220927220929561" style="zoom:50%;" />

+ 切换数据库：

  在Redis中数据库没有名称，默认有`16`个，通过索引值`0-15`进行标识，连接Redis默认选择第一个数据库。

  选择数据库：

  ```sql
  select db_index
  ```

  例：选择编号为`10`的数据库：

  ```sql
  select 10
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927221249145.png" alt="image-20220927221249145" style="zoom:50%;" />

## Redis 数据结构与操作类型

Redis的数据结构为**键值对**（`Key-Value`）形式，每条数据都是⼀个键值对。

其中键不能重复，且类型为`字符串`。

值的类型可以有以下五种：

+ **字符串**`string`
+ **哈希表**`hash`
+ **列表**`list`
+ **集合**`set`
+ **有序集合**`zset`

对于其中的数据，有以下四种操作行为：

+ **保存**（增）
+ **修改**（改）
+ **获取**（查）
+ **删除**（删）

即增删改查。

## Redis 数据类型与操作

### 字符串`string`

#### 概述

字符串类型是Redis中最为基础的数据存储类型。

它在Redis中是以二进制形式进行安全存储的，这便意味着该类型可以接受任何格式的数据，如JPEG图像数据或Json对象描述信息等。

在Redis中字符串类型的值`Value`最多可以容纳的数据长度是`512M`。

#### 基本操作

##### 保存

如果设置的键不存在则为添加，如果设置的键已经存在则修改：

+ 设置键值：

  ```sql
  set key value
  ```

  例：设置键为`name`值为`tuling`的数据：

  ```sql
  set name DrSHW
  ```

+ 设置键值及过期时间，以秒为单位：

  ```sql
  setex key seconds value
  ```

  例：设置键为`token`值为`abc123`，过期时间为`3`秒的数据：

  ```sql
  setex token 3 abc123
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927221715277.png" alt="image-20220927221715277" style="zoom:50%;" />

  可见超时后，数据就被自动清理了。

+ 设置多个键值

  ```sql
  mset key1 value1 key2 value2 ...
  ```

  例：设置键为`a1`值为`Python`，键为`a2`的值为`Java`，键为`a3`的值为`Go`：

  ```sql
  mset a1 Python a2 Java a3 Go
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927222007767.png" alt="image-20220927222007767" style="zoom:50%;" />

##### 获取

+ 获取：根据键获取值，如果不存在此键则返回`nil`：

  ```sql
  get key
  ```

  例：获取键`name`的值：

  ```sql
  get name
  ```

  不演示了。

+ 根据多个键获取多个值：

  ```sql
  mget key1 key2 ...
  ```

  例：获取键`a1`、`a2`、`a3`的值：

  ```sql
  mget a1 a2 a3
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927223617611.png" alt="image-20220927223617611" style="zoom:50%;" />

##### 删除

详解下面的键操作，删除键时值即会被删除。

#### 键操作

+ 查找键，参数支持正则表达式：

  ```sql
  keys pattern
  ```

  例：查看所有键：

  ```sql
  keys *
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927224150379.png" alt="image-20220927224150379" style="zoom:50%;" />

  例：查看名称中以`a`开头的键：

  ```sql
  keys a*
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927224213587.png" alt="image-20220927224213587" style="zoom:50%;" />

+ 判断键是否存在，如果存在返回`1`，不存在返回`0`：

  ```sql
  exists key
  ```

  例：判断键`a1`是否存在：

  ```sql
  exists a1
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927224422855.png" alt="image-20220927224422855" style="zoom:50%;" />

+ 查看键对应的`value`类型，为Redis支持的五种类型中的一种：

  ```sql
  type key
  ```

  例：查看键`a1`的值类型：

  ```sql
  type a1
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927224626979.png" alt="image-20220927224626979" style="zoom:50%;" />

+ 删除键对应的值，返回删除成功的键个数：

  ```sql
  del key1 key2 ...
  ```

  例：删除键`a2`、`a3`：

  ```sql
  del a2 a3
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927224828799.png" alt="image-20220927224828799" style="zoom:50%;" />

+ 设置过期时间，以秒为单位：

  如果没有指定过期时间则一直存在，直到使用`DEL`移除：

  ```sql
  expire key seconds
  ```

  例：设置键`a1`的过期时间为`10`秒：

  ```sql
  expire a1 10
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927225145876.png" alt="image-20220927225145876" style="zoom:50%;" />

+ 查看有效时间，以秒为单位；对于永久保存的数据，返回`-1`，对于不存在的数据，返回`-2`：

  ```sql
  ttl key
  ```

+ 例：查看键`bb`的有效时间：

  ```sql
  ttl bb
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927225441663.png" alt="image-20220927225441663" style="zoom:50%;" />

### 哈希表`hash`

#### 概述

`hash`类型用于存储对象，对象的结构为属性、值，其中值的类型为`string`。

#### 基本使用

##### 保存

+ 设置单个属性：

  ```sql
  hset key field value
  ```

  例：设置键`user`的属性`name`为`DrSHW`：

  ```sql
  hset user name DrSHW
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230002704.png" alt="image-20220927230002704" style="zoom:50%;" />

+ 设置多个属性：

  ```sql
  hmkey key field1 value1 field2 value2 ...
  ```

  例：设置键`u2`的属性`name`为`Dustella`、属性`age`为`20`：

  ```sql
  hmset u2 name Dustella age 20
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230222214.png" alt="image-20220927230222214" style="zoom:50%;" />

##### 获取

+ 获取指定键的所有属性：

  ```sql
  hkeys key
  ```

  例：获取键`u2`的所有属性：

  ```sql
  hkeys u2
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230423941.png" alt="image-20220927230423941" style="zoom:50%;" />

+ 获取指定键指定属性的值：

  ```sql
  hget key field
  ```

  例：获取键`u2`属性`name`的值：

  ```sql
  hget u2 name
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230601482.png" alt="image-20220927230601482" style="zoom:50%;" />

+ 获取多个属性的值：

  ```sql
  hmget key field1 field2 ...
  ```

  例：获取键`u2`属性`name`、`age`的值：

  ```sql
  hmget u2 name age
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230741598.png" alt="image-20220927230741598" style="zoom:50%;" />

+ 获取所有属性的值：

  ````sql
  hvals key
  ````

  例：获取键`u2`所有属性的值：

  ```sql
  hvals u2
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230911337.png" alt="image-20220927230911337" style="zoom:50%;" />

##### 删除

+ 删除整个`hash`键及值，使用`del`命令即可；

+ 删除属性，属性对应的值会被一起删除：

  ```sql
  hdel kty field1 field2 ...
  ```

+ 例：删除键`u2`的属性`age`：

  ```sql
  hdel u2 age
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927231137022.png" alt="image-20220927231137022" style="zoom:50%;" />

### 哈希表`hash`

#### 概述

`hash`类型用于存储对象，对象的结构为属性、值，其中值的类型为`string`。

#### 基本使用

##### 保存

+ 设置单个属性：

  ```sql
  hset key field value
  ```

  例：设置键`user`的属性`name`为`DrSHW`：

  ```sql
  hset user name DrSHW
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230002704.png" alt="image-20220927230002704" style="zoom:50%;" />

+ 设置多个属性：

  ```sql
  hmkey key field1 value1 field2 value2 ...
  ```

  例：设置键`u2`的属性`name`为`Dustella`、属性`age`为`20`：

  ```sql
  hmset u2 name Dustella age 20
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230222214.png" alt="image-20220927230222214" style="zoom:50%;" />



##### 获取

+ 获取指定键的所有属性：

  ```sql
  hkeys key
  ```

  例：获取键`u2`的所有属性：

  ```sql
  hkeys u2
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230423941.png" alt="image-20220927230423941" style="zoom:50%;" />

+ 获取指定键指定属性的值：

  ```sql
  hget key field
  ```

  例：获取键`u2`属性`name`的值：

  ```sql
  hget u2 name
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230601482.png" alt="image-20220927230601482" style="zoom:50%;" />

+ 获取多个属性的值：

  ```sql
  hmget key field1 field2 ...
  ```

  例：获取键`u2`属性`name`、`age`的值：

  ```sql
  hmget u2 name age
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230741598.png" alt="image-20220927230741598" style="zoom:50%;" />

+ 获取所有属性的值：

  ````sql
  hvals key
  ````

  例：获取键`u2`所有属性的值：

  ```sql
  hvals u2
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927230911337.png" alt="image-20220927230911337" style="zoom:50%;" />

##### 删除

+ 删除整个`hash`键及值，使用`del`命令即可；

+ 删除属性，属性对应的值会被一起删除：

  ```sql
  hdel kty field1 field2 ...
  ```

+ 例：删除键`u2`的属性`age`：

  ```sql
  hdel u2 age
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927231137022.png" alt="image-20220927231137022" style="zoom:50%;" />

### 列表`list`

#### 概述

列表中的元素类型为`string`，会按照插入排序顺序排序。

#### 基本使用

##### 保存

+ 在左侧插入数据：

  ```sql
  lpush key value1 value2
  ```

  例：从键为`a1`的列表左侧加入数据`a`、`b`、`c`：

  ```sql
  lpush a1 a b c
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927231842250.png" alt="image-20220927231842250" style="zoom:50%;" />

+ 在右侧插入数据：

  ```sql
  rpush key value1 value2
  ```

  例：从键为`a1`的列表右侧加入数据`0`、`1`：

  ```sql
  rpush a1 0 1
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927232054777.png" alt="image-20220927232054777" style="zoom:50%;" />

##### 获取

+ 返回列表里指定范围内的元素：

  + `start`、`stop`为元素的下标索引；
  + 索引从左侧开始，第一个元素为0；
  + 索引可以是负数，表示从尾部开始计数，如`-1`表示最后一个元素；

+ 语法形式：

  ```sql
  lrange key start stop
  ```

  例：获取键为`a1`的列表所有元素：

  ```sql
  lrange a1 0 -1
  ```

  不演示了。

##### 删除

+ 删除指定元素：

  + 将列表中前`count`次出现的值为`value`的元素移除；
  + `count > 0`：从头往尾移除；
  + `count < 0`：从尾往头移除；
  + `count = 0`：移除所有；

+ 语法形式：

  ```sql
  lrem key count value
  ```

  例：向列表`a2`中加入元素`a`、`b`、`a`、`b`、`a`、`b`：

  ```sql
  lpush a2 a b a b a b
  ```

  例：从`a2`列表右侧开始删除第`2`个`b`：

  ```sql
  lrem a2 -2 b
  ```

  例：查看列表`a2`的所有元素：

  ```sql
  lrange a2 0 -1
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927234140744.png" alt="image-20220927234140744" style="zoom:50%;" />

### 集合`set`

#### 概述

`set`为无序集合，其中的元素均为`string`类型，且元素具有**唯一性**，不重复。

无修改操作。

#### 基本操作

##### 保存

+ 添加元素：

  ```sql
  sadd key member1 member2 ...
  ```

  例：向键`a3`的集合中添加元素`PJJ`、`GP`、`ZXP`：

  ```sql
  sadd a3 PJJ GP ZXP
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927234515402.png" alt="image-20220927234515402" style="zoom:50%;" />

##### 获取

+ 返回所有的元素：

  ```sql
  smembers key
  ```

  例：获取键`a3`的集合中的所有元素：

  ```sql
  smembers a3
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927234712247.png" alt="image-20220927234712247" style="zoom:50%;" />

##### 删除

+ 删除指定元素

  ```sql
  srem key
  ```

  例：删除键`a3`集合中元素`GP`：

  ```sql
  srem a3 GP
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927234850296.png" alt="image-20220927234850296" style="zoom:50%;" />

### 有序集合`zset`

#### 概述

`zset`即`sorted set`，为有序集合。其中的元素为`string`类型，且元素具有**唯一性**，不重复。

每个元素都会关联一个`double`类型的`score`，表示权重，通过权重将元素从小到大排序。

没有修改操作

#### 基本操作

##### 保存

+ 添加：

  ```sql
  zadd key score1 member1 score2 member2 ...
  ```

  例：向键`a4`的集合中添加元素`DrSHW`、`Dustella`、`ZL`、`LJJ`，权重分别为`4`、`5`、`6`、`3`：

  ```sql
  zadd a4 4 DrSHW 5 Dustella 6 ZL 3 LJJ
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927235519763.png" alt="image-20220927235519763" style="zoom:50%;" />

##### 获取

+ 返回指定范围内的元素；

+ `start`、`stop`为元素下标的索引；

+ 索引从左侧开始，第一个元素为`0`；

+ 索引可以是负数，表示从尾部开始计数，如`-1`表示最后一个元素：

  ```sql
  zrange key start stop
  ```

  例：获取键`a4`的集合中所有元素：

  ```sql
  zrange a4 0 -1
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220927235808375.png" alt="image-20220927235808375" style="zoom:50%;" />

#### 删除

+ 删除指定元素：

  ```sql
  zrem key member1 member2 ...
  ```

  例：删除集合`a4`中的元素`DrSHW`：

  ```sql
  zrem a4 DrSHW
  ```

  <img src="https://images.drshw.tech/images/notes/image-20220928000053141.png" alt="image-20220928000053141" style="zoom:50%;" />



## Python操作Redis

### 准备工作

需要下载`redis`模块：

```bash
pip install redis
```

这个模块中提供了`Redis`对象，用于连接Redis服务器，并按照不同类型提供了不同方法，进行交互操作。

引入方式：

```python
from redis import *
```

### Redis 对象方法

通过`init`创建对象，指定参数`host`、`port`连接指定的服务器端口，`host` 默认为`localhost`，`port`默认为`6379`，`db`默认为`0`。

```python
from redis import Redis
# 连接Redis服务
sr = Redis(host='localhost', port=6379, db=0)
# 简写
sr = Redis()
```

根据不同的类型，拥有不同的实例方法可以调用，与前面的`redis`命令对应，方法需要的参数与命令的参数一致。

### `string`类型操作

`string`操作使用最为广泛，这里讲一下。

#### 保存操作

+ 方法`set`，添加或更改键、值，如果操作成功则返回`True`，如果操作失败则返回`False`；

+ 编写代码如下：

  ```python
  from redis import *
  
  if __name__ == '__main__':
      try:
          # 创建Redis对象，与Redis服务器建立连接
          sr = Redis()
          # 添加键name，值为DrSHW
          result = sr.set('name', 'DrSHW')
          # 输出响应结果，如果添加成功返回True，否则返回False
          print(result)
      except Exception as e:
          print(e)
  ```

#### 获取键操作

+ 方法`keys`，根据正则表达式获取键；

+ 编写代码如下：

  ```python
  from redis import *
  
  if __name__ == '__main__':
      try:
          # 创建Redis对象，与Redis服务器建立连接
          sr = Redis()
          # 获取所有的键
          result = sr.keys()
          # 输出响应结果，所有的键构成一个列表，如果没有键则返回空列表
          print(result)
      except Exception as e:
          print(e)
  ```

#### 获取值操作

+ 方法`get`，添加键对应的值，如果键存在则返回对应的值，如果键不存在则返回`None`；

+ 编写代码如下：

  ```python
  from redis import *
  
  if __name__ == '__main__':
      try:
          # 创建Redis对象，与Redis服务器建立连接
          sr = Redis()
          # 获取键name对应的值
          result = sr.get('name')
          # 输出键的值，如果键不存在，输出None
          print(result)
      except Exception as e:
          print(e)
  ```

#### 删除操作

+ 方法`delete`，删除键及对应的值，如果删除成功则返回受影响的键数，否则返回`0`；

+ 编写代码如下：

  ```python
  from redis import *
  
  if __name__ == '__main__':
      try:
          # 创建Redis对象，与Redis服务器建立连接
          sr = Redis()
          # 删除键为name的键值对
          result = sr.delete('name')
          # 输出响应结果，如果删除成功则返回受影响的键值对数量，否则返回0
          print(result)
      except Exception as e:
          print(e)
  ```

### 其余类型

见官方文档：https://redis-py.readthedocs.io/en/latest/#indices-and-tables 。

