---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

# 垃圾回收与内存管理

## 1. 引用计数器

### 1.1 循环双向链表 refchain

在Python程序中创建的任何对象都会放在`refchain`链表中，大体形态如下：

![image-20220706171200665](https://images.maiquer.tech/images/wx/x1.1.png)

当执行的语句需要开辟内存时，程序底层会创建一个结构体，其中必定包含四个固定的值：

​		**上一个对象指针**、**下一个对象指针**（双向链表指针 ）、**类型**、**引用的个数**（这个内存被引用了多少次 ）

也会包含不同数据类型**特定的内容**。

以下方Python程序的执行为例：

```python
name = 'DrSHW'
age = 20
colleagues = ['dustella', 'ljj', '瑾知']
```

底层：

```
name = 'DrSHW' => 创建结构体，包含上一个对象指针、下一个对象指针、类型、引用的个数、value="DrSHW"
age = 20	   => 创建结构体，包含上一个对象指针、下一个对象指针、类型、引用的个数、value=18
colleagues = ['dustella', 'ljj', '瑾知'] => 创建结构体，包含上一个对象指针、下一个对象指针、类型、引用的个数、items=元素、元素个数=3
```

来看一段C源码：

```c
#define PyObject_HEAD       PyObject ob_base;
#define PyObject_VAR_HEAD       PyVarObject ob_base;

// 宏定义，包含 上一个、下一个，用于创建双向链表用。（放在refchain链表中时要用到 ）
#define _PyObject_HEAD_EXTRA                \
    struct _object *ob_next;                \
    struct _object *ob_prev;
    
typedef struct _object {	// 这个结构体封装了四个固定的值
    _PyObject_HEAD_EXTRA    // 用于构造结构体，承接第5行的宏定义，正式声明两个指针
    Py_ssize_t on_refcnt;    // 引用计数器
    struct _typeonject *ob_type;    // 数据类型
} PyObject;

typedef struct {		// 在四个固定的值上又加了一个数据个数，用于由多个元素组成的元素（如list ）的封装
    PyObject ob_base;   // PyObject对象，即不变的四个值
    Py_ssize_t ob_size; // Number of items in variable part，即元素个数
} PyVarObject;
```

在C源码中如何体现每个对象中都有相同的价值？	即`PyObject`结构体。

由多个元素组成的对象，由`PyObject`结构体 + `ob_size`构成，多一个固定字段元素个数。

各个类型结构体中封装的元素如下：

+ `float`类型

```c
typedef struct {
    PyObject_HEAD       // 引宏定义
    double ob_fval;     // 简单地存了一个C语言中的长浮点数
} PyFloatObject;
```

+ `int `类型

```c
struct _longobject{
    PyObject_VAR_HEAD       // 引宏定义
    digit ob_digit[1];      // Python中的整数远比我们想的复杂，自带了高精度
};
/* Long (arbitrary precision) integer object interface */
typedef struct _longobject PyLongObject;
```

+ `list`类型

```c
typedef struct {
    PyObject_VAR_HEAD       // 引宏定义
    /* 由Python语言特性，list中存储的不可变类型本质上都是引用，故存具体元素的*地址* */
    PyObject **ob_item;
    Py_ssize_t allocated;   // 预分配内存
} PyListObject;
```

+ `tuple` 类型

```c
typedef struct {
    PyObject_VAR_HEAD       // 引宏定义
    PyObject *ob_item[1];   // 存放元素
} PyTupleObject;
```

+ `dict `类型

```c
typedef struct {
    PyObject_HEAD       // 引宏定义
    Py_ssize_t ma_used; // 预分配内存
    PyDictKeysObject *ma_keys;  // 存储键
    PyObject **ma_values;   // 存储值
} PyDictObject;
```

### 1.2 类型封装结构体

以创建一个float类型变量为例，假设有一行Python代码：

```python
pi = 3.14
```

则会按照 `PyFloatObject` 结构体创建数据，如下：

```c
struct PyFloatObject{
	struct _object *ob_next;                \
    struct _object *ob_prev;
	Py_ssize_t on_refcnt;    
    struct _typeonject *ob_type;
    double ob_fval;
} var1;
var1.ob_next = refchain中的下一个对象地址;
var1.ob_prev = refchain中的上一个对象地址;
var1.onrefcnt = 1;
var1.ob_type = &float;
var1.ob_fval = 3.14;
```

### 1.3 引用计数器

当Python程序运行时，会根据数据类型的不同找到其对应的结构体，并根据结构体的字段来进行创建相关的数据。然后将对象添加到`refchain`双向链表中。

核心就是源码中两个关键的结构体`PyObject`与`PyVarObject`。

其中的`ob_refcnt`就是引用计数器，其值默认为1，当其他对象对这个对象进行引用时，引用计数器则会发生变化。

当一个对象的引用计数器为0时，意味着这个对象需要被**垃圾回收**，即对象从`refchain`中**移除**，并将对象**销毁**，**内存归还**系统（暂不考虑缓存机制 ）。

+ 引用示例：

  ```python
  a = 114515	# 初始化，计数器值为1
  b = a	# 添加了引用b => b对应对象引用计数器+1
  ```

​	可通过`print(id(a) == id(b))`的结果为`True`看出两变量有相同的内存地址。

+ 删除引用示例：

  ```python
  a = 114514 	# 初始化，计数器值为1
  b = a	# 添加了引用b => b对应对象引用计数器+1
  del b 	# 变量b被删除 => b对应对象引用计数器-1
  del a 	# 变量a被删除 => a对应对象引用计数器-1，计数器值变为0，垃圾回收
  '''
  当一个对象的引用计数器为0时，意味着这个对象需要被垃圾回收
  '''
  ```

例：执行以下代码：

```python
name = 'alex'	# 创建对象并初始化引用计数器为1
a = name		# 计数器发生变化
b = name
c = b
e = a

db = "老男孩"		# 创建对象并初始化引用计数器为1
```

执行后，`refchain`链表状态如下：

![image-20220706195248564](https://images.maiquer.tech/images/wx/x1.2.png)

### 1.4 循环引用&交叉感染

我们先看下面的代码：

```python
v1 = [1, 2, 3]	# refchain中创建一个列表对象，由于v1=对象，所以列表引用对象计数器为1
v2 = [4, 5, 6]	# refchain中创建一个列表对象，由于v2=对象，所以列表引用对象计数器为1
v1.append(v2)	# 把v2追加到v1中，则v2对应的[4, 5, 6]对象的引用计数器加1（相当于现有两个对象v1[3]、v2指向之 ），最终为2
v2.append(v1)	# 把v1追加到v2中，则v1对应的[1, 2, 3]对象的引用计数器加1（相当于现有两个对象v2[3]、v1指向之 ），最终为2
```

执行后，`refchain`链表状态如下：

![image-20220706200900182](https://images.maiquer.tech/images/wx/x1.3.png)

紧接着执行如下代码：

```python
del v1	# 引用计数器-1
del v2	# 引用计数器-1
```

执行后，两个列表对应对象的引用计数器均-1，变为1，但不会被回收，导致这两个链表一直占用内存而无法被销毁，出现问题。

即为**循环引用问题**。

Python使用**标记清除**来解决循环引用问题。

## 2. 标记清除

目的：为了解决引用计数器的循环引用问题。

实现方式：在Python底层 再 维护一个链表，专门存储可能存在循环引用的对象(list/tuple/dict/set)。

左图为`refchain`链表，而右图为专门存储可能存在循环引用的链表，这些对象在两个链表里都会出现：

![image-20220706201812754](https://images.maiquer.tech/images/wx/x1.4.png)

在Python内部，*某种情况* 下，程序会扫描右链表中的每个元素，检查是否有循环引用。若有，则让双方引用计数器-1；若引用计数器为0，则垃圾回收。

存在的问题：

+ 什么时候扫描？
+ 可能存在循环引用的链表扫描代价大，每次扫描耗时久。

Python使用**分代回收**来解决这两个问题。

## 3. 分代回收

将可能存在循环引用的对象分别维护，形成三个链表，分为**0代、1代、2代**，大致如下：

![image-20220706202750521](https://images.maiquer.tech/images/wx/x1.5.png)

三个链表扫描的时机：

+ 0代：

  0代中对象个数达到700个，扫描一次。

+ 1代：

  0代扫描了10次后，1代扫描一次。

+ 2代：

  1代扫描了10次后，2代扫描一次。

## 4. 缓存

Python在内存管理中也引入了缓存机制。

### 4.1 池 (int)

为了避免重复的创建和销毁一些常见对象，Python内部维护了一个**池**。

在启动解释器时，Python内部会帮我们创建：-5, -4, ..., 256, 257这些数，并放入池中。Python认定这些数很常用，这些数的引用计数器也不可能为0。

若执行以下代码：

```python
v1 = 7	# 7已创建，内部不开辟内存，直接在池中获取
v2 = 9	# 9已创建，内部不开辟内存，直接在池中获取
v3 = 9	# 9已创建，内部不开辟内存，直接在池中获取
```

### 4.2 free_list机制 (float/list/tuple/dict)

当引用计数器为0时，有时不会进行回收，而是将对象添加到一个叫`free_list`链表中作为缓存。

后续创建对象时，将不再开辟内存，而是直接使用`free_list`。

若`free_list`长度达到上限，则销毁计数器为0的对象。

执行以下代码：

```python
v1 = 3.14	# 开辟内存，创建结构体，加入refchain
del v1 		# refchain中移除，将对象添加至free_list中(假设未超出长度上限)
v9 = 66.99	# 不会重新开辟内存，而是去free_list中获取类型一样的对象，并将对象内部数据初始化，并加入refchain
```

测试：

+ `float`类型，维护的`free_list`链表最多可缓存100个`float`对象。

  ```python
  v1 = 3.14    	# 开辟内存来存储float对象，并将对象添加到refchain链表。
  print(id(v1)) 	
  del v1    		# 引用计数器-1，如果为0则在rechain链表中移除，不销毁对象，而是将对象添加到float的free_list.
  v2 = 9.999    	# 优先去free_list中获取对象，并重置为9.999，如果free_list为空才重新开辟内存。
  print(id(v2)) 	
  ```
  

两次输出结果一致。

- `int`类型，不是基于`free_list`，而是维护一个`small_ints`链表保存常见数据（小数据池 ），小数据池范围：`-5 <= value < 257`。即：重复使用这个范围的整数时，不会重新开辟内存。

  ```python
  v1 = 38    		# 去小数据池small_ints中获取38整数对象，将对象添加到refchain并让引用计数器+1。  
  print(id(v1))  	 
  v2 = 38 		# 去小数据池small_ints中获取38整数对象，将refchain中的对象的引用计数器+1。  
  print(id(v2))
  ```

  两次输出结果一致。

  注意：在解释器启动时候`-5~256`就已经被加入到`small_ints`链表中且引用计数器初始化为`1`，代码中使用的值时直接去`small_ints`中拿来用并将引用计数器+1即可。另外，`small_ints`中的数据引用计数器永远不会为`0`（初始化时就设置为`1`了 ），所以也不会被销毁。

- `str`类型，维护`unicode_latin1[256]`链表，内部将所有的`ascii字符`缓存起来，以后使用时就不再反复创建。

  ```python
  v1 = "A"  
  print(id(v1)) 	 
  del v1  
  v2 = "A"  
  print(id(v1)) 	
  ```

  两次输出结果一致。

  除此之外，Python内部还对字符串做了**驻留机制**，针对那么只含有字母、数字、下划线的字符串，如果内存中已存在则不会重新在创建而是使用原来的地址里（不会像`free_list`那样一直在内存存活，只有内存中有才能被重复利用 ），验证：

  ```python
  v1 = "DrSHW"  
  v2 = "DrSHW"  
  print(id(v1) == id(v2)) # 输出：True
  ```

- `list`类型，维护的`free_list`数组最多可缓存80个list对象。

  ```python
  v1 = [1, 2, 3]  
  print(id(v1))  
  del v1  
  v2 = ["dust","ella"]  
  print(id(v2)) 
  ```

  两次输出结果一致

- `tuple`类型，维护一个`free_list`数组且数组容量20，数组中元素可以是链表且每个链表最多可以容纳2000个元组对象。元组的`free_list`数组在存储数据时，是按照元组可以容纳的个数为索引找到`free_list`数组中对应的链表，并添加到链表中。

  ```python
  v1 = (1,2)  
  print(id(v1))  
  del v1  # 因元组的数量为2，所以会把这个对象缓存到free_list[2]的链表中  
  v2 = ("DrSHW", "Dustella")  # 不会重新开辟内存，而是去free_list[2]对应的链表中拿到一个对象来使用。  
  print(id(v2))
  ```

  两次输出结果一致。

- `dict`类型，维护的`free_list`数组最多可缓存`80`个`dict`对象。

  ```python
   v1 = {"k1": 123}  
   print(id(v1))
   del v1  
   v2 = {"name":"dustella", "age": 18, "gender": "男"}  
   print(id(v2)) 
  ```

​		两次输出结果一致。

## 5. 源码分析

以`float`类型为例：

### 5.1 创建

执行Python代码：

```python
name = "DrSHW"
```

当在Python中创建一个字符串数据时，底层会触发他的如下源码：

```c
Objects/unicodeobject.c
PyObject *
PyUnicode_DecodeUTF8Stateful(const char *s,Py_ssize_t size,const char *errors,Py_ssize_t *consumed)
{
    return unicode_decode_utf8(s, size, _Py_ERROR_UNKNOWN, errors, consumed);
}
static PyObject *
unicode_decode_utf8(const char *s, Py_ssize_t size,_Py_error_handler error_handler, const char *errors,Py_ssize_t *consumed);
{
    ...
    // 如果字符串长度为1，并且是ascii字符，直接去缓存链表 *unicode_latin1[256] 中获取。
    if (size == 1 && (unsigned char)s[0] < 128) {
        if (consumed)
            *consumed = 1;
        return get_latin1_char((unsigned char)s[0]);
    }
    // 对传入的utf-8的字节进行处理，并选择合适的方式转换成unicode字符串。（latin2/ucs2/ucs4 ）。
    ...
    return _PyUnicodeWriter_Finish(&writer);
}
static PyObject*
get_latin1_char(unsigned char ch)
{
    PyObject *unicode = unicode_latin1[ch];
    if (!unicode) {
        unicode = PyUnicode_New(1, ch);
        if (!unicode)
            return NULL;
        PyUnicode_1BYTE_DATA(unicode)[0] = ch;
        assert(_PyUnicode_CheckConsistency(unicode, 1));
        unicode_latin1[ch] = unicode;
    }
    Py_INCREF(unicode);
    return unicode;
}
PyObject *
_PyUnicodeWriter_Finish(_PyUnicodeWriter *writer)
{
    PyObject *str;
    // 写入值到str
    str = writer->buffer;
    writer->buffer = NULL;
    if (writer->readonly) {
        assert(PyUnicode_GET_LENGTH(str) == writer->pos);
        return str;
    }
    if (PyUnicode_GET_LENGTH(str) != writer->pos) {
        PyObject *str2;
        // 创建对象
        str2 = resize_compact(str, writer->pos);
        if (str2 == NULL) {
            Py_DECREF(str);
            return NULL;
        }
        str = str2;
    }
    assert(_PyUnicode_CheckConsistency(str, 1));
    return unicode_result_ready(str);
}
static PyObject*
resize_compact(PyObject *unicode, Py_ssize_t length)
{
    ...
    // 开辟内存
    new_unicode = (PyObject *)PyObject_REALLOC(unicode, new_size);
    if (new_unicode == NULL) {
        _Py_NewReference(unicode);
        PyErr_NoMemory();
        return NULL;
    }
    unicode = new_unicode;
    // 把对象加入到refchain链表
    _Py_NewReference(unicode);
    ...
    return unicode;
}
```

在字符串中除了会执行上述代码之外，还会执行以下代码实现内部的驻留机制。为了更好的理解，你可以认为驻留机制：将字符串保存到一个名为 `interned` 的字典中，以后再使用时**直接去字典中获取不再需要创建**。

实际在源码中每次都会创建新的字符串，只不过在内部检测是否已驻留到`interned`中，如果在则使用`interned`内部的原来的字符串，把新创建的字符串当做垃圾去回收，如下：

```c
Objects/unicodeobject.c
void
PyUnicode_InternInPlace(PyObject **p)
{
    PyObject *s = *p;
    PyObject *t;
#ifdef Py_DEBUG
    assert(s != NULL);
    assert(_PyUnicode_CHECK(s));
#else
    if (s == NULL || !PyUnicode_Check(s))
        return;
#endif
    /* If it's a subclass, we don't really know what putting
       it in the interned dict might do. */
    if (!PyUnicode_CheckExact(s))
        return;
    if (PyUnicode_CHECK_INTERNED(s))
        return;
    if (interned == NULL) {
        interned = PyDict_New();
        if (interned == NULL) {
            PyErr_Clear(); /* Don't leave an exception */
            return;
        }
    }
    Py_ALLOW_RECURSION
    // 将新字符串驻留到interned字典中，不存在则驻留，已存在则不再重复驻留。
    t = PyDict_SetDefault(interned, s, s);
    Py_END_ALLOW_RECURSION
    if (t == NULL) {
        PyErr_Clear();
        return;
    }
    // 存在，使用已驻留的字符串 并 将引用计数器+1
    if (t != s) {
        Py_INCREF(t);
        Py_SETREF(*p, t); // 处理临时对象
        return;
    }
    /* The two references in interned are not counted by refcnt.
       The deallocator will take care of this */
    Py_REFCNT(s) -= 2; // 让临时对象可被回收。
    _PyUnicode_STATE(s).interned = SSTATE_INTERNED_MORTAL;
}
```

### 5.2 引用

执行以下代码：

```python
name = 'DrSHW'
val = name
```

在项目中如果出现这种引用关系时，会将原对象的引用计数器+1。
C源码执行流程如下：

```c
// Include/object.h
static inline void _Py_INCREF(PyObject *op)
{
    _Py_INC_REFTOTAL;
    // 对象的引用计数器 + 1
    op->ob_refcnt++;
}
#define Py_INCREF(op) _Py_INCREF(_PyObject_CAST(op))
```

### 5.3 销毁

执行以下代码：

```python
name = "DrSHW"
del name
```

在项目中如果出现这种删除的语句，则内部会将引用计数器-1，如果引用计数器减为0，则进行缓存或垃圾回收。

```c
// Include/object.h
static inline void _Py_DECREF(const char *filename, int lineno,
                              PyObject *op)
{
    (void)filename; /* may be unused, shut up -Wunused-parameter */
    (void)lineno; /* may be unused, shut up -Wunused-parameter */
    _Py_DEC_REFTOTAL;
    // 引用计数器-1，如果引用计数器为0，则执行 _Py_Dealloc去缓存或垃圾回收。
    if (--op->ob_refcnt != 0) {
#ifdef Py_REF_DEBUG
        if (op->ob_refcnt < 0) {
            _Py_NegativeRefcount(filename, lineno, op);
        }
#endif
    }
    else {
        _Py_Dealloc(op);
    }
}
#define Py_DECREF(op) _Py_DECREF(__FILE__, __LINE__, _PyObject_CAST(op))
```

```c
// Objects/object.c
void
_Py_Dealloc(PyObject *op)
{
    // 找到str类型的 tp_dealloc 函数
    destructor dealloc = Py_TYPE(op)->tp_dealloc;
    // 在refchain双向链表中摘除此对象。
    _Py_ForgetReference(op);
    // 执行float类型的 tp_dealloc 函数，去进行缓存或垃圾回收。
    (*dealloc)(op);
}
void
_Py_ForgetReference(PyObject *op)
{
    ...
    // 在refchain链表中移除此对象
    op->_ob_next->_ob_prev = op->_ob_prev;
    op->_ob_prev->_ob_next = op->_ob_next;
    op->_ob_next = op->_ob_prev = NULL;
    _Py_INC_TPFREES(op);
}
```

```c
// Objects/unicodeobject.c
PyTypeObject PyUnicode_Type = {
    PyVarObject_HEAD_INIT(&PyType_Type, 0)
    "str",                        /* tp_name */
    sizeof(PyUnicodeObject),      /* tp_basicsize */
    0,                            /* tp_itemsize */
    /* Slots */
    (destructor)unicode_dealloc,  /* tp_dealloc */
       ...
    PyObject_Del,                 /* tp_free */
};
static void
unicode_dealloc(PyObject *unicode)
{
    switch (PyUnicode_CHECK_INTERNED(unicode)) {
    case SSTATE_NOT_INTERNED:
        break;
    case SSTATE_INTERNED_MORTAL:
        /* revive dead object temporarily for DelItem */
        Py_REFCNT(unicode) = 3;
        // 在interned中删除驻留的字符串
        if (PyDict_DelItem(interned, unicode) != 0)
            Py_FatalError(
                "deletion of interned string failed");
        break;
    case SSTATE_INTERNED_IMMORTAL:
        Py_FatalError("Immortal interned string died.");
        /* fall through */
    default:
        Py_FatalError("Inconsistent interned string state.");
    }
    if (_PyUnicode_HAS_WSTR_MEMORY(unicode))
        PyObject_DEL(_PyUnicode_WSTR(unicode));
    if (_PyUnicode_HAS_UTF8_MEMORY(unicode))
        PyObject_DEL(_PyUnicode_UTF8(unicode));
    if (!PyUnicode_IS_COMPACT(unicode) && _PyUnicode_DATA_ANY(unicode))
        PyObject_DEL(_PyUnicode_DATA_ANY(unicode));
    // 内存中销毁对象
    Py_TYPE(unicode)->tp_free(unicode);
}
```

