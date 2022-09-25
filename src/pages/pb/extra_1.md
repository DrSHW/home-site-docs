---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

# 类型标注

## 引言

尽管Pyhton从3.5版本开始就引入了类型系统，但到目前为止，接受程度不是特别的高，很多的开源库仍然没有使用类型标注。

究其原因，我认为最主要的一条是类型标注不是必须的，且Python解释器并**不检查你所做的类型标注**，那么大家在代码里添加类型标注的动力也就不大。而且，官方文档没有尽全力为大家解释该如何使用类型标注，这使得很多想要使用类型标注的人望而却步。

本文将通过实际的例子为你展示如何在Python代码里做类型标注。

## 准备

需要准备Python静态类型检查器——**mypy**：

`mypy` 具有强大且易于使用的类型系统，具有很多优秀的特性，例如类型推断、泛型、可调用类型、元组类型、联合类型和结构子类型。

要注意的是，`mypy` 需要 Python 3.5 或更高版本才能运行。

安装指令：`pip install mypy`

使用方式：`mypy 文件名`，对文件进行类型检查。

## 使用

### 1. 为变量做类型标注

我们先来通过最简单的情况，为变量做类型标注，变量可以有如下类型：

1. `int`
2. `float`
3. `bool`
4. `str`
5. `bytes`
6. `None`
7. `list`
8. `tuple`
9. `set`
10. `dict`

#### 1.1 简单的数据类型

`int, float, bool, str, None, bytes` 这些都是最简单的数据类型，他们的类型标注也是最简单的，

格式为`变量名: 类型 = 值`，创建`type.py`，如下：

 ```python
 a: int = 8
 b: bool = True
 c: str = 'ok'
 d: None = None
 e: float = 9.8
 f: bytes = b'32'
 ```

使用`mypy`对类型标注进行检查：

`mypy type.py`

检查结果：

`Success: no issues found in 1 source file`

这说明我们对这4种变量的类型标注是正确的，但上面的代码**存在严重的缺陷**，变量`d`我为它标注为`None`，那么`d`这个变量就永远只能为`None`了，如果我将其赋值为其他类型，类型标注检查就会报错, 修改代码如下：

 ```python
a: int = 8
b: bool = True
c: str = 'ok'
d: None = None
e: float = 9.8
f: bytes = b'32'

d = 5
 ```

检查结果：

````
type.py:8: error: Incompatible types in assignment (expression has type "int", variable has type "None")
Found 1 error in 1 file (checked 1 source file)
````

即使出现了类型问题，Python代码也可以正常运行，不会管类型标注，但是将`5`赋值给`d`就不符合类型标注的要求了。

**类型标注的意义是标注一个变量的数据类型，此后的代码都应当遵守对这个变量的类型标注，这就要求我们，不能随意的修改变量的数据类型。**

#### 1.2 使用Optional

在1.1的例子中，`d`变量别标注为`None`类型，可一个变量始终赋值为`None`是毫无意义的事情，你只是在最初的时候不想给它一个明确的值才赋值为`None`的，后面的代码一定会修改变量`d`的值。

假设你对变量`d`的使用是希望为它赋值一个`int`类型的数据，那么在类型标注的时候，就应当做好准备。

在`typing`模块中，我们可以引入`Option`关键字，代表<u>可选的</u>，使用格式为`Option[可用类型名]`，修改代码如下：

```python
from typing import Optional		# 导入模块

a: int = 8
b: bool = True
c: str = 'ok'
d: Optional[int] = None			# 暂时为None，后续可改为int
e: float = 9.8
f: bytes = b'32'

d = 5
```

`Optional`表示可选，那么`d`就可以被赋值成`int`类型，此外也可以是`None`。

#### 1.3 使用Union

若一个值可以是两种类型，可以使用`typing`模块中的`Union`关键字，它可以结合多种类型。

比如`d`能赋值成`int`，也可能被赋值成`float`， 这种情况，要结合`Optional` 和` Union`。

```python
from typing import Optional, Union

a: int = 8
b: bool = True
c: str = 'ok'
d: Optional[Union[int, float]] = None
e: float = 9.8
f: bytes = b'32'

d = 5
d = 9.8
d = None
```

`Union`表示**或**的意思，`d`变量的类型，可以是`None`，也可以是`int`或者`float`。

接下来，你可能会问，可不可以将`a`变量的类型标注设置为`Union[int, float]`， 让`a`以赋值成`int`也可以赋值成为`float`？ 

从纯粹的技术实现上讲这样做没有问题：

```python
from typing import Optional, Union

a: Union[int, float] = 8    			# 不要这样做
b: bool = True
c: str = 'ok'
d: Optional[Union[int, float]] = None
e: float = 9.8
f: bytes = b'32'

d = 5
d = 9.8
d = None

a = 8.9
```

但从工程实践的角度来看，这种做法简直就是脱裤子放屁，多此一举。我们为变量进行类型标注的目的就是为了防止变量在使用过程中由于缺乏类型检查导致类型变来变去，你这样不就是又回到了之前的状态了么，那做类型标注还有什么意义呢，还不如不做。

`d`变量与其他几个变量不同，`d`变量初始值赋值为`None`，我们心里很清楚，它的值一定会被改变的，不然留着它毫无意义， 而一旦改变，就必然导致数据类型发生变化，因此才需要我们使用`Optional`。其他变量呢，值改变了，数据类型可以不发生变化，如果类型发生了变化，说明你的操作就违背了类型标注的初衷。

#### 1.4 使用Any

若一个变量可以是任意类型，使用`typing`模块中的`Any`关键字。`Any`也算一种类型，使用如下：

```python
from typing import Any

a: Any = 8    						# 不要这样做

a = 'OK'							# 可以改为任何类型，并通过类型检查
a = []
```

也可以通过类型检查，但是和上面一样，**非常不推荐**。

#### 1.5 为容器类型做标注

`list, tuple, dict, set`， 为这4个容器类型数据做标注，要稍微麻烦一些。

需要先引入`typing`模块中对应的容器类型`Set, List, Tuple`。

#### 1.5.1 为集合做标注

在使用`set`时，我们默认只会向集合中添加**相同**数据类型的值，但你要明确一点，集合可以存储不同类型的数据。

```python
from typing import Optional, Union, Any, Set

s: Set[int] = {1, 2, 3}
```

这段代码可以通过`mypy`的检查。

#### 1.5.2 为列表做标注

列表标注的方式与集合是一样的：

```python
from typing import Optional, Union, Any, Set, List, Tuple

s: Set[int] = {1, 2, 3}
l: List[int] = [1, 2, 3]
```

但我们都清楚，列表里存储的数据往往都是类型不相同的，比如下面的列表：

```
[1, 2, 3, 'a', 'b', True]
```

对这种情况，就需要使用1.3小节所介绍的`Union`：

```python
from typing import Union, Set, List

s: Set[int] = {1, 2, 3}
l: List[Union[int, str, bool]] = [1, 2, 3, 'a', 'b', True]
```

#### 1.5.3 为元组做标注

为元组做标注，不能使用和列表相同的办法，而是要**逐个索引位置**进行标注：

```python
from typing import Tuple

t: Tuple[int, str, bool] = (3, 'ok', True)
```

#### 1.5.4 为字典做标注

先来看最简单的，字典的`key`都是字符串，`value`都是`int`。

```python
from typing import Dict

d: Dict[str, int] = {'ok': 4}
```

这是最理想的情况，但实际情况往往更复杂。

字典的`key`可以有`str`类型，也可以有`int`类型，当类型不确定的时候，我们就可以使用`Union`：

```python
from typing import Union, Dict

d: Dict[str, int] = {'ok': 4}
d1: Dict[Union[str, int], Union[str, int, float]] = {'ok': 4, 3: 'ok', 4: 3.2}
```

还有更复杂的情况，`value`对应的是容器类型：

```python
from typing import Union, Tuple, Dict

dic: Dict[str, Union[Tuple[int, int], Dict[int, int]]] = {
    'ok': (1, 2),
    'dic': {5: 9}
}
```

字典里的`value`，可以是元组，也可以是字典，字典嵌套了字典，在做类型标注的时候，也就需要以嵌套的形式进行标注。对于这种复杂的字典，可以将其简化处理：

```python
from typing import Union, Tuple, Dict

dic: Dict[str, Union[Tuple, Dict]] = {
    'ok': (1, 2),
    'dic': {5: 9}
}
```

`value`可以是元组，也可以是字典，我只要标注到这个程度就可以了，不再继续详细的进行标注.不然单单一个类型标注就把代码搞得过于晦涩了。

#### 1.5.5 容器类型标注总结

容器类型标注，可以粗略的进行标注，也可以详细的进行标注，这完全取决于你的想法，在不影响代码可阅读性的前提下详细标注，反之则粗略标注：

```python
from typing import Union, List

l: List = [1, 2, ['2', '3']]            # 粗略标注
l2 : List[Union[int, List[str]]] = [1, 2, ['2', '3']]   # 详细标注
```

### 2. 为函数做标注类型

#### 2.1 对形参和返回值进行标注

为函数做标注类型，需要对每一个**形参**做类型标注，同时还要对函数的**返回值**做类型标注：

格式形如：

```python
def 函数名(参数1: 参数1类型, 参数2: 参数2类型, ...) -> 返回值类型:
    函数代码体
其他程序代码
```

例如：

```python
def add(x: int, y: int) -> int:
    return x + y

print(add(2, 5))
```

形参的变量类型，我们事先是清楚的，因此你只需要按照第一节里的讲解对形参进行标注就可以了，函数的返回值在函数定义时进行标注，在有括号后面紧跟着进行标注，注意需要用到`->`。

如果返回值的类型可能是`int`，也可能是`None`，该怎么标注呢？其实这种情况完全可以参考对变量的标注，使用`Optional`即可：

```python
from typing import Optional


def add(x: Optional[int], y: int) -> Optional[int]:
    if not isinstance(x, int):
        return None
    return x + y

add(3, 4)
add(None, 4)
```

看到这里你应该明白，对函数参数及返回值的标注，完全遵守对变量的标注规则，唯一需要区别对待的是函数的**返回值**。

#### 2.2 对可变参数进行标注

Python的可变参数一个是`*args`， 一个是`**kwargs`，从函数的视角来看，`args`的类型是元组，`kwargs`的类型是字典，

先来看`args`：

```python
def add(*args: int) -> int:
    sum_value = sum(args)
    return sum_value

print(add(1, 2, 3))
```

如果很确定`args`里的元素都是`int`类型，那么直接标注为`int`就可以了；

如果还有其他类型，那么就需要使用`Union`：

```python
from typing import Union


def add(*args: Union[str, int, float]) -> float:
    sum_value = sum([float(item) for item in args])
    return sum_value

print(add(1, '2', 3.8))
```

传入的可变参数可以是`str, int, float`中的任意一个，`args`虽然是元组，但是我们不是按照元组来进行标注，标注的是对这些参数的期望值.

对于`**kwargs`，我们已经知道它是字典，只要对它的`value`进行标注即可：

```python
from typing import Union


def add(**kwargs: Union[int, str, float]) -> None:
    print(kwargs)

dic = {
    'a': 3,
    'b': '5',
    'c': 9.3
}

add(**dic)
add(a=3, b='5', c=9.3)
```

关键字参数的值，有`int, str, float`三个类型，我们要标注的是这些参数的**值**，而不是字典。

#### 2.3 Callable对象做参数

在Python中，函数也是对象，也可以作为函数的参数。可使用`typing`模块中的`Callable`进行类型标注：

```python
from typing import Callable, Any, Union
import time
from functools import wraps


def cost(func: Callable):
    @wraps(func)
    def warpper(*args: Any, **kwargs: Any):
        t1 = time.time()
        res = func(*args, **kwargs)
        t2 = time.time()
        print(func.__name__ + "执行耗时" +  str(t2-t1))
        return res
    return warpper

@cost
def test(sleep_time: Union[float, int]) -> None:
    """
    测试装饰器
    :param sleep_time:
    :return:
    """
    time.sleep(sleep_time)


test(1)
```

当形参是函数对象时，使用`Callable`进行标注。

### 3. 标注自定义类

#### 3.1 自定义类实例

在程序里自定义了一个类，对于这个类的实例，我们也可以标注，类型名即为**类名**：

```python
class Demo():
    pass

d : Demo = Demo()

def test(demo: Demo):
    pass

test(d)
```

#### 3.2 标注类属性

类属性可以使用`ClassVar`进行标注，标注后，如果实例尝试修改类属性，`mypy`在检查时会报错，但Python解释器可以正常执行程序，原因前面已经强调过，解释器不受类型标注影响：

```python
from typing import ClassVar

class Demo():
    count: ClassVar[int] = 0

d: Demo = Demo()

print(d.count)
d.count = 20  			# mypy 检查会报错
```

### 4. 不常见的类型标注

有些对象的类型不如基础数据类型那样常见，我这里做一个总结并一一举例说明。

#### 4.1 迭代器

可使用`typing`模块中的`Iterator`进行类型标注：

```python
from typing import Iterator

def my_generator(n: int) -> Iterator:
    index = 0
    while index < n:
        yield index
        index += 1

generate = my_generator(5)
```

`my_generator`是生成器函数，它的返回值是一个`generator`类型的对象，是一个迭代器，它的返回值就可以标注为`Iterator`。

#### 4.2 字典的items(), keys(), values()返回值

字典的`items()`，`keys()`，`values()`三个方法分别返回字典的`key-value`对，所有的`key`和`values`，

可使用`typing`模块中的`ItemsView, KeysView, ValuesView`进行类型标注，方法如下：

```python
from typing import ItemsView, KeysView, ValuesView


def test_1() -> ItemsView:
    dic = {'name': 'python'}
    return dic.items()


def test_2() ->KeysView:
    dic = {'name': 'python'}
    return dic.keys()


def test_3() ->ValuesView:
    dic = {'name': 'python'}
    return dic.values()
```

#### 4.3 Sequence

`Sequence` 可以用来标记任何序列对象，比如列表，元素，字符串，字节串，他们都是序列。如果你对变量的类型不是很确定，但可以肯定它一定是一个序列，那么就可以使用`Sequence`。

同样地，也是导入`typing`模块中的`Sequence`：

```python
from typing import Sequence, List


lst: Sequence[int] = []
name: Sequence = 'python'
tup: Sequence = (1, 2, 4.5)
bstring: Sequence = b'sds'
```

### 5. 泛型和TypeVar工厂函数

**泛型**和`TypeVar`工厂函数，都是为了更方便的进行类型标注而存在的。假设你现在要定义一个栈，Stack类，你需要一个列表来存储数据，此时，你会遇到一个难处，如果这个栈只允许`int`类型数据入栈，那么你就只能这样定义：

```python
from typing import List

class Stack():
    def __init__(self):
        self.data: List[int] = []
```

但如果这个栈只允许`float`类型的数据入栈，你就只能这样来定义：

```python
class Stack():
    def __init__(self):
        self.data: List[float] = []
```

这样就有点犯难了，两个存储不同数据类型的栈就需要两个定义，但这两个类的代码是完全一致的，只是类型标注不同，有没有什么办法，可以用一套代码实现不同类型的标注呢？

这就要用到**泛型**和`TypeVar`函数，需要引入`typing`模块中的`TypeVar, Generic`：

```python
from typing import TypeVar, Generic, List


T = TypeVar('T')


class Stack(Generic[T]):
    def __init__(self):
        self.data: List[T] = []

    def push(self, item: T):
        self.data.append(item)

    def pop(self) -> T:
        return self.data.pop(-1)

    def top(self) -> T:
        return self.data[-1]

    def size(self) -> int:
        return len(self.data)

    def is_empty(self) -> bool:
        return len(self.data) == 0

stack = Stack[int]()
stack.push(3)
stack.push(5)
print(stack.pop())
```

我定义一个泛型，所谓泛型，就是先不明确它的类型，那么什么时候明确它的类型呢，等到实际调用的时候，比如：

```python
stack = Stack[int]()
```

我在创建`stack`对象时来确定泛型`T`的数据类型，如果你希望栈只存储`float`类型数据，你就可以这样来写：

```python
stack = Stack[float]()
```

使用泛型，相当于创建了一个模板，在调用模板前，来确定泛型的数据类型，一套代码就能实现了多套数据类型标注，岂不美哉？