---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

项目地址：https://github.com/DrSHW/Lemon 。

# Lemon 简介

Lemon 是一个简化的可自举的C语言词法、语法分析器，借鉴了著名的C4项目，它的设计思路和配置如下：

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

## Lemon的设计思路

`Lemon`是一个简化后的C语言编译器，采用：

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
+ 数据区（Data ）：存放静态数据，
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
else if (op == LEA)     ax = (int)(bp + *pc++);         // load effective addr
else if (op == LC)      ax = *(char*)ax;                // load char
else if (op == LI)      ax = *(int*)ax;                 // load int
else if (op == SC)      *(char*)*sp++ = ax;             // save char to stack
else if (op == SI)      *(int*)*sp++ = ax;              // save int to stack
else if (op == PUSH)    *--sp = ax;                     // push ax to stack

```

##### 运算指令集

| 指令                          | 解释     |
| ----------------------------- | -------- |
| `ADD/SUB/MUL/DIV/MOD/SHL/SHR` | 算数运算 |
| `OR/XOR/AND`                  | 逻辑运算 |
| `EQ/NE/LT/LE/GT/GE`           | 比较运算 |

对应代码：

```c
// 运算符，这里就不细讲了
else if (op == ADD)     ax = *sp++ +  ax;        
else if (op == SUB)     ax = *sp++ -  ax;
else if (op == MUL)     ax = *sp++ *  ax;
else if (op == DIV)     ax = *sp++ /  ax;
else if (op == MOD)     ax = *sp++ %  ax;
else if (op == SHL)     ax = *sp++ << ax;
else if (op == SHR)     ax = *sp++ >> ax;
else if (op == OR)      ax = *sp++ |  ax;
else if (op == XOR)     ax = *sp++ ^  ax;
else if (op == AND)     ax = *sp++ &  ax;
else if (op == EQ)      ax = *sp++ == ax;
else if (op == NE)      ax = *sp++ != ax;
else if (op == LT)      ax = *sp++ <  ax;
else if (op == LE)      ax = *sp++ <= ax;
else if (op == GT)      ax = *sp++ >  ax;
else if (op == GE)      ax = *sp++ >= ax;
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
// new stack frame for vars: 存储 bp 副本（用于找到原先位置）, bp 指向调用函数的地址, 栈中给函数的变量添加新的内存空间
else if (op == NVAR)    {*--sp = (int)bp; bp = sp; sp = sp - *pc++;}
// delete stack frame for args: 与 x86 的设计一样，DARG N -> 销毁栈中前 N 个元素
else if (op == DARG)    sp = sp + *pc++;
// return caller: 将栈和对应指针恢复到调用前的样子, pc 指针指向调用函数的位置
else if (op == RET)     {sp = bp; bp = (int*)*sp++; pc = (int*)*sp++;} 
```

##### Native-call

直接搬运C4项目中的`Native-call`，贴代码：

```c
// native call，直接搬运 C4  项目中的配置
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

## 词法分析程序设计

### 设计目的

使用C语言编写词法分析程序，从左到右扫描源代码文件，将源代码文件中的单词分割出来，获得单词的种别码（token）。

词法分析程序需要实现以下功能：

1. 能够删去源代码文件中的注释（注：Lemon中不支持宏（#），因此也会删除宏定义）。
2. 能够删去源代码文件中的空格、制表符、换行符等空白字符。
3. 能够维护程序的行号与列号，遇到错误时能够输出错误信息，包括错误的行号、列号、错误类型。
4. 能够识别类C语言的关键字、运算符、常数、标识符等单词，将其分割出来，获得单词的二元形式种别码。

### 符号定义

词法分析程序中的符号定义如下：

CMM语言中的保留字及属性

| 词素 | 词法单元名 | 属性值 | 词素 | 词法单元名 | 属性值 |
| --- | --- | --- | --- | --- | --- |
| auto | _AUTO | 0 | int | _INT | 16 |
| break | _BREAK | 1 | long | _LONG | 17 |
| case | _CASE | 2 | register | _REGISTER | 18 |
| char | _CHAR | 3 | return | _RETURN | 19 |
| const | _CONST | 4 | short | _SHORT | 20 |
| continue | _CONTINUE | 5 | signed | _SIGNED | 21 |
| default | _DEFAULT | 6 | sizeof | _SIZEOF | 22 |
| do | _DO | 7 | static | _STATIC | 23 |
| double | _DOUBLE | 8 | struct | _STRUCT | 24 |
| else | _ELSE | 9 | switch | _SWITCH | 25 |
| enum | _ENUM | 10 | typedef | _TYPEDEF | 26 |
| extern | _EXTERN | 11 | union | _UNION | 27 |
| float | _FLOAT | 12 | unsigned | _UNSIGNED | 28 |
| for | _FOR | 13 | void | _VOID | 29 |
| goto | _GOTO | 14 | volatile | _VOLATILE | 30 |
| if | _IF | 15 | while | _WHILE | 31 |

CMM语言中的保留字及属性：

| 词素 | 词法单元名 | 属性值 | 词素 | 词法单元名 | 属性值 |
| --- | --- | --- | --- | --- | --- |
| + | PLUS | 32 | | | OR |
| - | MINUS | 33 | ! | NOT | 53 |
| * | STAR | 34 | && | ANDAND | 54 |
| / | DIV | 35 | || |
| % | MOD | 36 | ^ | BITXOR | 56 |
| ++ | PLUSPLUS | 37 | ~ | BITNOT | 57 |
| -- | MINUSMINUS | 38 | << | LEFTMOVE | 58 |
| = | ASSIGN | 39 | >> | RIGHTMOVE | 59 |
| += | PLUSEQUAL | 40 | ? | QUESTION | 60 |
| -= | MINUSEQUAL | 41 | : | COLON | 61 |
| *= | STAREQUAL | 42 | , | COMMA | 62 |
| /= | DIVEQUAL | 43 | ; | SEMICOLON | 63 |
| %= | MODEQUAL | 44 | ( | LPARENT | 64 |
| == | EQUAL | 45 | ) | RPARENT | 65 |
| != | NOTEQUAL | 46 | [ | LBRACKET | 66 |
| > | GREAT | 47 | ] | RBRACKET | 67 |
| < | LESS | 48 | { | LBRACE | 68 |
| >= | GREATEQUAL | 49 | } | RBRACE | 69 |
| <= | LESSEQUAL | 50 | " | DOUBLEQUOTE | 70 |
| & | AND | 51 | ' | SINGLEQUOTE | 71 |
| $ | END | 76 ||||
|CMM语言中的常量、标识符及属性：||||||

| 词素 | 词法单元名 | 属性值 |
| --- | --- | --- |
| 数字常量 | INTCON | 72 |
| 字符常量 | CHARCON | 73 |
| 字符串常量 | STRCON | 74 |
| 标识符 | IDENFR | 75 |

CMM语言词法分析中的错误类型：

| <u>**错误类型**</u> |
| --- |
| **多行注释（ /**/ ）不匹配** |
| **非法标识符** |
| **非法数值** |
| **字符常量为空** |
| **字符常量中包含大于一个字符** |
| **单引号（''）不匹配** |
| **双引号（""）不匹配** |
| **非法字符** |

### 设计原理

#### 正则表达式

正则表达式是一种用于描述字符串的语言，它是由一些特殊的字符和运算符组成的字符串，这些特殊的字符和运算符可以用来描述一些字符串的集合。正则表达式的运算符有以下几种：

1. 字符串连接运算符：用于连接两个正则表达式，连接后的正则表达式表示的是两个正则表达式所表示的字符串集合的交集。
2. 字符串并运算符：用于连接两个正则表达式，连接后的正则表达式表示的是两个正则表达式所表示的字符串集合的并集。
3. 字符串闭包运算符：用于将一个正则表达式闭包，闭包后的正则表达式表示的是闭包前的正则表达式所表示的字符串集合的闭包。 
4. 字符串选择运算符：用于连接两个正则表达式，连接后的正则表达式表示的是两个正则表达式所表示的字符串集合的并集。

#### 有穷状态自动机DFA

有穷状态自动机（DFA）是一种用于描述字符串集合的模型，它由五元组`(Q, Σ, δ, q0, F)`表示，其中：

1. `Q`是有穷的状态集合。
2. `Σ`是有穷的输入符号集合。
3. `δ`是状态转移函数，`δ：Q×Σ→Q`。
4. `q0`是初始状态，`q0∈Q`。
5. `F`是终止状态集合，`F⊆Q`。

### 详细设计 

#### 执行流程

![image-20221227232747759](https://images.drshw.tech/images/notes/image-20221227232747759.png)

#### 相关变量定义

`char *key[]`：保留字数组，用于判断单词是否为保留字；

`char *op[]`：运算符数组，用于判断单词是否为运算符；

`enum tokenTypes`：枚举类型，对应单词的属性值；

`char sourceCode[]`：源程序字符串；

`int curLine`：当前行号；

`int curCol`：当前列号；

`char token[]`：当前单词；

`int tokenType`：当前单词的属性值；

`int codePos`：源程序字符串的当前位置；

#### 相关函数定义

`int isKeyword(char s[])`：传入单词s，判断是否为保留字，若是则返回1，否则返回0；

`int isLetter(char c)`：传入字符c，判断是否为字母或下划线，若是则返回1，否则返回0；

`int isDigit(char c)`：传入字符c，判断是否为数字，若是则返回1，否则返回0；

`int isIdentifier(char *c)`：传入单词c，判断是否为标识符，若是则返回1，否则返回0；

`int isDecDigit(char *c)`：传入单词c，判断是否为十进制整数，若是则返回1，否则返回0；

`int isOctDigit(char *c)`：传入单词c，判断是否为八进制整数，若是则返回1，否则返回0； 

## 语法分析程序设计

### LR分析法

LR分析法是一种自底向上的"移进-归约"分析法，L是指自左向右扫描输入的单词，R是指自右向左归约产生的非终结符，即最右推导的逆过程。它的基本思想是：将文法转换为一个有穷状态自动机，然后对输入的字符串进行扫描，根据当前状态和输入符号的对应关系，转换到下一个状态，直到到达终止状态，或者出现错误。

LR分析法具有以下特点：

1. 识别能力强，能够识别绝大多数的上下文无关文法。
2. 执行效率高，能够在`O(n)`的时间内完成分析。
3. 分析表占用空间小，只需存储状态转换信息，不需要存储文法信息。

由于LR分析法中的状态转换是根据当前输入符号来进行的，因此当文法中存在左递归的情况时，就会出现冲突。由此，引入了`LR(k)`分析法，它的基本思想是：在LR分析法的基础上，对每个状态增加一个`lookahead`符号，从而使得每个状态都能够根据当前输入符号和`lookahead`符号来进行转移，`k`表示`lookahead`符号的个数。

### LR(1)分析表生成程序

#### 设计目的

`LR(1)`分析表生成程序先根据类C语言的文法生成`LR(1)`项目集规范族，再根据`LR(1)`项目集规范族生成`LR(1)`分析表。`LR(1)`分析表生成程序需要实现以下功能：

1. 能够读取类C语言的文法。
2. 能够根据类C语言的文法生成`LR(1)`项目集规范族、`FIRST`集。
3. 能够实现`GO`函数、闭包（`CLOSURE`）函数。
4. 能够根据`LR(1)`项目集规范族、`FIRST`集生成`LR(1)`分析表。

#### 设计原理

首先引入项目集规范族的概念，项目集规范族是指一组项目集，其中每个项目集都是由项目集规范族中的其他项目集通过规约或移进操作得到的。项目集规范族的构造过程如下：

1. 从文法的开始符号开始，构造一个项目集，该项目集包含文法的开始符号的所有产生式，且开始符号的点在第一个位置；

2. 构造所有项目，将所有产生式的点都向右移动一位，并将产生式的左部和右部分别作为项目的左部和右部，项目的点位置为产生式的点的位置，项目的点后面的符号为产生式的点后面的符号，项目的点前面的符号为产生式的点前面的符号；

3. 构造闭包函数`CLOSURE(I)`，其功能是将项目集中的每个项目的点后面的符号扩展到项目集中；

   构造过程如下：

   1. I的任何项目都属于`CLOSURE(I)`；

   2. 若项目`[A→α·Bβ, a]`属于`CLOSURE(I)`，`B→γ`属于文法的产生式，那么，对于`FIRST(βa)`中的终结符b，如果`[B→·γ, b]`不属于`CLOSURE(I)`，则将其加入；

   3. 重复执行步骤2，直到项目集不再增加为止；

      其中，`FIRST`集的构造过程如下：

      对于每一文法符号`X∈VT∪VN`，连续使用下面的规则，直至每个集合`FIRST`不再增加为止：

      1. 若`X∈VT`，则`FIRST(X)={X}`；
      2. 若`X→VN`，且有产生式`X→a...`，则把a加入到FIRST(X)中；若`X→ε`，则把`ε`也加入到`FIRST(X)`中；
      3. 若`X→Y1Y2...Yk`，是一个产生式，且`Y∈VN`，则把FIRST(Y1)中的所有非ε符号加入到`FIRST(X)`中，若`Y1...Yk→ε`，则把`FIRST(Y2)`中的所有非ε符号加入到`FIRST(X)`中，依次类推，直到`Yk`不是`ε`，或者`Yk`不是一个非终结符号为止；

4. 构造状态转换函数`GO(I, X)`，其功能是将项目集I中的每个项目的点后面的符号为X的项目集合，构造过程如下：
   1. 若项目`[A→α·Xβ, a]`属于`I`，那么，对于`FIRST(βa)`中的终结符`b`，如果`[A→αX·β, b]`不属于`GO(I, X)`，则将其加入；
   2. 对于`GO(I, X)`中的每个项目，执行`CLOSURE`操作；

5. 构造文法`G'`的`LR(1)`分析表，

   其构造过程如下：

   1. 若项目`[A→α·aβ, a]`属于`Ik`且`GO(Ik, a)=Ij`，则将`action[k, a]`置为`sj`；
   2. 若项目`[A→α·, a]`属于则将`action[k, a]`置为`rj`；其中假定`A→α`是文法`G'`的第`j`个产生式；
   3. 若项目`[S'→S·, $]`属于`Ik`，则将`action[k, $]`置为`acc`；
   4. 若项目`[A→α·Xβ, a]`属于`Ik`且`GO(Ik, X)=Ij`，则将`goto[k, X]`置为`j`；
   5. 凡是没有被赋值的`action[k, a]`和`goto[k, X]`，则置为`err`，表示错误。


#### 详细设计

`LR(1)`表生成程序由两个子模块组成，分别为项目集族生成模块和`LR(1)`分析表生成模块。

##### 全局数据结构及变量定义

`typedef pair<string, vector<string>> Production`：文法规则（产生式）类型；

`string all_terminals[]`：所有终结符数组，与词法分析模块中的终结符数组一致；

使用`Project`结构体表示项目，包含以下成员：

`string left`：产生式左部；

`vector<string> right`：产生式右部；

`set<string> expect`：展望串集合。

`const bool operator<(const Project &p) const`：重载小于运算符，用于比较两个项目是否相等；

`const bool operator==(const Project &p) const`：重载等于运算符，用于比较两个项目是否相等；

##### 项目集族生成模块

使用`itemSet`结构体表示项目集，封装必要方法，包含以下成员：

`vector<string> terminal`：终结符集合；

`set<string> non_terminal`：非终结符集合，使用set是为了去重；

`vector<string> all_symbols`：所有符号集合，包括终结符和非终结符；

`map<string, int> symbol_hash`：符号哈希表，用于判断某个符号是否在符号集合中；

`vector<Production> productions`：产生式集合；

`set<Production> items`：项目集合，即加·后的产生式集合；

`void gen_poj()`：生成项目集族，即生成`items`；

##### LR(1)分析表生成模块

使用`LR1`结构体表示`LR(1)`分析表，封装必要方法，包含以下成员：

`ItemSet is`：项目集信息；

`vector<set<Project>> can_col`：产生式项目集规范族；

`string lr1[][]`：`LR(1)`分析表；

`set<string> _first(vector<string> X)`：求`FIRST(X)`；

`set<Project> _go(set<Project> I, string X)`：求`GO(I, X)`；

`set<Project> _closure(set<Project> I)`：求`CLOSURE(I)`；

`void gen_lr1()`：生成`LR(1)`分析表；

`void save_lr1()`：保存`LR(1)`分析表至`LR(1).txt`文件；

### 语法分析程序

#### 设计目的

语法分析程序即根据`LR(1)`分析表对类C语言源代码文件进行语法分析，输出语法树。语法分析程序需要实现以下功能：

1. 能够读取类C语言的文法、`LR(1)`分析表。
2. 能够根据`LR(1)`分析表对类C语言源代码文件进行语法分析，正确进行移进、归约、接受操作。
3. 能够输出并保存语法树。
4. 能够输出错误信息，包括错误的行号、列号、错误类型。

#### 设计原理

如下图，LR分析程序需要读取输入串和分析栈中的内容，根据LR分析表中的状态转换信息，进行状态转换，直到到达终止状态，或者出现错误。

![image-20221227235436886](https://images.drshw.tech/images/notes/image-20221227235436886.png)

LR分析表由动作表`action`和状态转换表`goto`组成，在程序中使用二维数组存储。

动作表`action`用于存储状态转换信息，即根据当前状态和输入符号来确定下一个状态。若二维数组的行Si表示状态，列`Ti`表示输入符号，数组的元素`action[Si][Ti]`表示从状态`Si`转移到状态`action[Si][Ti]`的动作。动作分为三种：

1. 移进动作（`si`）：表示从状态Si转移到状态`action[Si][Ti]`，并将输入符号`Ti`压入栈中。
2. 规约动作（`ri`）：表示应使用第`action[Si][Ti]`条产生式对栈中的符号进行规约，若产生式的长度为`n`，则从栈中弹出`n`个符号，并将产生式左部的符号压入栈中，然后根据`goto`表转移到下一个状态。
3. 接受动作（`acc`）：表示分析成功，语法分析结束。

状态转换表`goto`用于存储非终结符的转换信息，即根据当前状态和非终结符来确定下一个状态；二维数组的行`Si`表示状态，列`Ni`表示非终结符，数组的元素`goto[Si][Ni]`新的栈顶状态。

总结而言，LR分析法的分析过程如下：

1. 将输入串和分析栈初始化，输入串的第一个符号为$，分析栈的第一个符号为0。
2. 从输入串中读取一个符号，根据当前状态和输入符号，从LR分析表中查找下一个状态。
3. 若为移进动作，则将输入符号压入分析栈，将下一个状态压入分析栈，然后读取下一个输入符号。
4. 若为规约动作，则从分析栈中弹出产生式右部的符号，找到产生式左部非终结符的编号，然后根据`goto`表查找下一个状态，将产生式左部的符号压入分析栈，将下一个状态压入分析栈。

各个非终结符与其属性值对应关系如下表：

| 非终结符                  | 属性值 | 非终结符                        | 属性值 |
| ------------------------- | ------ | ------------------------------- | ------ |
| additive_expression       | 77     | parameter_list                  | 95     |
| argument                  | 78     | primary_expression              | 96     |
| argument_list             | 79     | program                         | 97     |
| assignment_expression     | 80     | relational_expression           | 98     |
| compound_statement        | 81     | return_type                     | 99     |
| equality_expression       | 82     | selection_statement             | 100    |
| expression                | 83     | statement                       | 101    |
| expression_statement      | 84     | statement_list                  | 102    |
| function_call             | 85     | struct_definition               | 103    |
| function_definition       | 86     | struct_definition_list          | 104    |
| function_definition_list  | 87     | struct_name                     | 105    |
| function_name             | 88     | struct_variable_definition      | 106    |
| initializer               | 89     | struct_variable_definition_list | 107    |
| initializer_list          | 90     | unary_expression                | 108    |
| iteration_statement       | 91     | unary_operator                  | 109    |
| jump_statement            | 92     | variable_definition             | 110    |
| multiplicative_expression | 93     | variable_definition_list        | 111    |
| parameter_declaration     | 94     |                                 |        |

5. 若为接受动作，则分析成功，语法分析结束；若为错误动作，则分析失败，语法分析结束。

#### 详细设计

##### 执行流程

<img src="https://images.drshw.tech/images/notes/image-20221228000420509.png" alt="image-20221228000420509" style="zoom: 80%;" />

##### 相关变量定义

`char *lr1`[][]：LR(1)分析表；

`int n, m`：LR(1)分析表的行数和列数；

`int totRule`：文法的总规则数；

`int ruleLen[]`：文法规则的长度；

`char *left[]`：文法左部；

`char *right`[][]：文法右部；

`char *non_terminal[]`：线性存储非终结符数组，偏移量为77；

使用`Node`结构体表示语法树的结点，包含以下成员：

`int id`：结点编号；

`int type`：结点类型；

`char *value`：结点值；

`struct Node *child`：第一个孩子结点；

`struct Node *siblings`：下一个兄弟结点；

`Node`结构体定义如下：

```c
struct Node
{
	int id;
	int type;
	char *value;
	struct Node *child;
	struct Node *siblings;
};
```

`struct Node *root`：语法树的根结点；

`struct Node *curNode`：当前结点；

##### 相关函数定义

`struct Node *newNode(int type, char *value)`：创建一个新结点，传入结点类型type和结点值value，返回新结点的指针；

`void addNode(struct Node *node)`：将结点`node`添加到当前结点`curNode`的孩子结点中，若当前结点`curNode`没有孩子结点，则将`node`作为当前结点`curNode`的孩子结点；打印并保存语法树边；

`void load_data()`：读取LR(1)分析表、文法规则文件；

`void parse(int *codePos, char *sourceCode, char *token, int *tokenType)`：语法分析函数，传入源程序字符串的当前位置`codePos`，源程序字符串`sourceCode`，当前单词`token`，当前单词的属性值`tokenType`。



## 程序交互

### 交互流程

本程序的词法、语法分析程序以函数的形式位于文件`main.c`中，使用C语言编写旨在能实现自举分析。而LR(1)表生成程序独立于源程序，无需实现自举，故使用数据结构更为丰富的C++语言编写，位于文件`lr1_generator.cpp`中。

如下图所示，在开始分析前，先由`LR(1)`表生成程序生成`LR(1)`分析表，然后将分析表写入文件`LR1.txt`中，供词法、语法分析程序读取。写入完毕后，启动词法、语法分析程序，程序首先读取`LR(1)`分析表。考虑到执行性能，本课程设计采用一遍扫描的方式实现词法、语法分析程序，即词法分析程序和语法分析程序共同扫描源程序，语法分析程序会主动调用词法分析程序`tokenize`，以获取下一个单词，对单词进行移进、规约操作，直至分析结束。

![image-20221228000508311](https://images.drshw.tech/images/notes/image-20221228000508311.png)

### 主程序编写

主程序模块较为简单，只需读取源代码，并进入语法分析程序入口即可，程序如下：

```c
int main()
{
	// 读取源代码
	FILE *fp = fopen("test.c", "r");
	if (fp == NULL)
	{
		printf("ERROR: file not found\n");
		return 0;
	}  
	char ch;
	int codeLen = 0;
	while ((ch = fgetc(fp)) != EOF)
	sourceCode[codeLen++] = ch;
	parse(&codePos, sourceCode, token, &tokenType);
	return 0;
}
```

### 执行方法

先执行`lr1_generator.cpp`，生成文件`LR(1).txt`，再调用`main.cpp`，生成语法树`SyntaxTree.txt`。



