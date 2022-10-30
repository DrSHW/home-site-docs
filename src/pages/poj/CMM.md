---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

本项目建设中。。。

项目地址：https://github.com/DrSHW/Lemon 。

# Lemon 简介

Lemon 是一个简化的可自举的C语言编译器（建设中 ），借鉴了著名的C4项目，它的设计思路和配置如下：

## 设计编译器的传统步骤

传统的编译器设计分为两个部分：前端(front-end)和后端(back-end)：

### 前端

在前端，需要词法分析器（scanner ）和语法分析器（parser ）来将源代码转变为生成语法树(**AST**)或过渡代码**IR(LLVM)**：

1. 词法分析：将可读的代码转变为可被计算机识别的`token`（这一过程也被称为`tokenlize` ）；

2. 语法分析：将一些语句转换为生成语法树(**AST**)或过渡代码**IR(LLVM)**；

   举个例子，有一个表达式: `(15 + 3 * 4) / 3`，

   将其转换为AST，形态如下：

   <img src="https://images.maiquer.tech/images/wx/pic1.png" alt="image-20220828181532096" style="zoom: 33%;" />
   
   我们也可以写出它的逆波兰表达式：`/(+(*34)15)3`，这个也很常用。

### 后端

后端也被分为了两部分：

1. 优化器（**optimizer** ）：是编译器设计过程中最复杂的部分。在这个部分，中间语言（intermediate code ）将进行优化以提升性能。

2. 代码生成器（Code generator ）：将中间代码转换为目标代码。

著名的`LLVM`可以帮助我们完成整个后端的操作（兼容全平台 ）。

## CMM 的设计思路

`CMM`是一个简化后的C语言编译器，采用：

+ **前后端不分离**的模式，无中间优化；
+ 基于自定义VM的目标代码；
+ `One-pass parser`，即源代码只读一遍即可生成目标代码。

### VM设计

第一步是VM的设计。

#### 总体设计

计算基于寄存器`Register`和方法栈`Stack`；

寄存器选用（仅一个通用寄存器 ）：

+ PC（Program Counter ）：程序计数器，
+ SP（Stack Pointer ）：堆栈寄存器，存放栈的偏移地址，
+ BP（Base Pointer ）：基数指针寄存器，用于SP的校准，
+ AX：通用寄存器；

内存空间分为三块：

+ 代码区（Code ）：存放编译好的VM指令，
+ 数据区（Data ）：存放数据，
+ 方法栈（Stack ）：进行函数和循环等一些复杂操作时进行优化；

指令集分为四种：

+ 存取指令集（save & load ），
+ 运算指令集（operation ），
+ 分支跳转指令集，
+ `Native-call`：用于动态分配内存。

#### 指令集设计

##### 存取指令集

| 指令          | 解释                   |
| ------------- | ---------------------- |
| `IMM`         | Load Immediately       |
| `LEA`         | Load Effective Adder   |
| `LC/CI/SC/SI` | Load/Save Integer/Char |
| `PUSH`        | 将数据压入栈顶。       |

对应代码：

```c
if (op == IMM)          ax = *pc++;                     // load immediate(or global addr)
else if (op == LEA)     ax = (int)(bp + *pc++);         // load local addr
else if (op == LC)      ax = *(char*)ax;                // load char
else if (op == LI)      ax = *(int*)ax;                 // load int
else if (op == SC)      *(char*)*sp++ = ax;             // save char to stack
else if (op == SI)      *(int*)*sp++ = ax;              // save int to stack
else if (op == PUSH)    *--sp = ax;                     // push ax to stack
```

##### 运算指令集

| 指令                  | 解释     |
| --------------------- | -------- |
| `ADD/SUB/MUL/DIV/MOD` | 算数运算 |
| `OR/XOR/AND`          | 逻辑运算 |
| `EQ/NE/LT/LE/GT/GE`   | 比较运算 |

对应代码：

```c
// 运算符，这里就不细讲了
else if (op == OR)      ax = *sp++ |  ax;
else if (op == XOR)     ax = *sp++ ^  ax;
else if (op == AND)     ax = *sp++ &  ax;
else if (op == EQ)      ax = *sp++ == ax;
else if (op == NE)      ax = *sp++ != ax;
else if (op == LT)      ax = *sp++ <  ax;
else if (op == LE)      ax = *sp++ <= ax;
else if (op == GT)      ax = *sp++ >  ax;
else if (op == GE)      ax = *sp++ >= ax;
else if (op == SHL)     ax = *sp++ << ax;
else if (op == SHR)     ax = *sp++ >> ax;
else if (op == ADD)     ax = *sp++ +  ax;        
else if (op == SUB)     ax = *sp++ -  ax;
else if (op == MUL)     ax = *sp++ *  ax;
else if (op == DIV)     ax = *sp++ /  ax;
else if (op == MOD)     ax = *sp++ %  ax;
```

##### 跳转指令集

| 指令   | 解释                                                         |
| ------ | ------------------------------------------------------------ |
| `JUMP` | 跳转至值所对地址                                             |
| `JZ`   | 传入`AX`，若`AX == 0`，则跳转（JUMP ）                        |
| `JNZ`  | 传入`AX`，若`AX != 0`，则跳转（JUMP ）                        |
| `CALL` | 跳转至函数所在地址                                           |
| `NVAR` | New Stack Frame for Vars，在栈中给函数的变量添加新的内存空间 |
| `DARG` | Delete Stack Frame for Args，销毁栈指针后的所有元素          |
| `RET`  | Return Caller，将栈和对应指针恢复到调用前的样子              |

对应代码：

```c
// 跳转指令
else if (op == JMP)     pc = (int*)*pc;                 // jump
else if (op == JZ)      pc = ax ? pc + 1 : (int*)*pc;   // jump if ax == 0
else if (op == JNZ)     pc = ax ? (int*)*pc : pc + 1;   // jump if ax != 0
// 一些在函数调用中常用到的复杂操作的说明
// call function: 将 pc + 1 压入栈顶 & pc 跳转至函数所在地址
else if (op == CALL)    {*--sp = (int)(pc+1); pc = (int*)*pc;}
// new stack frame for vars: 存储 bp 副本（用于找到原先位置 ）, bp 指向调用函数的地址, 栈中给函数的变量添加新的内存空间
else if (op == NVAR)    {*--sp = (int)bp; bp = sp; sp = sp - *pc++;}
// delete stack frame for args: 与 x86 的设计一样，DARG N -> 销毁栈中前 N 个元素
else if (op == DARG)    sp = sp + *pc++;
// return caller: 将栈和对应指针恢复到调用前的样子, pc 指针指向调用函数的位置
else if (op == RET)     {sp = bp; bp = (int*)*sp++; pc = (int*)*sp++;} 
```

##### Native-call

直接搬运C4项目中的`Native-call`，贴代码：

```c
// native call，直接搬运 C4 项目中的配置
else if (op == OPEN)    {ax = open((char*)sp[1], sp[0]);}
else if (op == CLOS)    {ax = close(*sp);}
else if (op == READ)    {ax = read(sp[2], (char*)sp[1], *sp);}
else if (op == PRTF)    {tmp = sp + pc[1] - 1; ax = printf((char*)tmp[0], tmp[-1], tmp[-2], tmp[-3], tmp[-4], tmp[-5]);}
else if (op == MALC)    {ax = (int)malloc(*sp);}
else if (op == FREE)    {free((void*)*sp);}
else if (op == MSET)    {ax = (int)memset((char*)sp[2], sp[1], *sp);}
else if (op == MCMP)    {ax = memcmp((char*)sp[2], (char*)sp[1], *sp);}
else if (op == EXIT)    {printf("exit(%lld)\n", *sp); return *sp;}
else {printf("ERROR: Unkown Instruction: %lld, cycle: %lld\n", op, cycle); return -1;}
```



