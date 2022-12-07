---
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

## 本章疑难点

### 课上知识点

#### 为什么进程调度是最基本的一种调度？

因为无论哪一种模型都有进程调度。

#### 关于多级反馈队列调度算法

若就绪队列1中无进程，处理机正在执行就绪队列2中的进程，此时一个新的进程到达了就绪队列1，处理机如何调度？

**解答：** 应立即中断就绪队列2的进程，而执行就绪队列1中的进程（抢占），被抢占的进程应放入就绪队列3。

若被中断的时间片还未结束，是让下一个进程将剩下的时间运行完毕还是空等？

**解答：** 不同操作系统处理的方式不同，视系统而定。

### 课上习题

#### FCFS、SJF、HRRF调度算法

若四个作业的到达时间、服务时间如下图：

| 作业 | 到达时间 | 服务时间 |
| ---- | -------- | -------- |
| J1   | 8:00     | 2.0      |
| J2   | 8:50     | 0.5      |
| J3   | 9:00     | 0.1      |
| J4   | 9:20     | 0.2      |

要求：分别用FCFS、SJF和HRRF三种调度算法，计算其平均周转时间和平均带权周转时间。

**解答：**

对于FCFS：各个进程的开始执行时间、完成时间、周转时间、带权周转时间如下：

| 作业 | 到达时间 | 服务时间 | 开始执行时间 | 完成时间 | 周转时间 | 带权周转时间 |
| ---- | -------- | -------- | ------------ | -------- | -------- | ------------ |
| J1   | 8:00     | 2.0      | 8:00         | 10:00    | 120 min  | 1            |
| J2   | 8:50     | 0.5      | 10:00        | 10:30    | 100 min  | 10/3         |
| J3   | 9:00     | 0.1      | 10:30        | 10:36    | 96 min   | 16           |
| J4   | 9:20     | 0.2      | 10:36        | 10:48    | 88 min   | 22/3         |

于是：

<img src="https://images.drshw.tech/images/notes/image-20221121232539730.png" alt="image-20221121232539730" style="zoom: 25%;" />

对于SJF：各个进程的开始执行时间、完成时间、周转时间、带权周转时间如下：

| 作业 | 到达时间 | 服务时间 | 开始执行时间 | 完成时间 | 周转时间 | 带权周转时间 |
| ---- | -------- | -------- | ------------ | -------- | -------- | ------------ |
| J1   | 8:00     | 2.0      | 8:00         | 10:00    | 120 min  | 1            |
| J2   | 8:50     | 0.5      | 10:18        | 10:48    | 118 min  | 59/15        |
| J3   | 9:00     | 0.1      | 10:00        | 10:06    | 66 min   | 11           |
| J4   | 9:20     | 0.2      | 10:06        | 10:18    | 58 min   | 29/6         |

于是：

<img src="https://images.drshw.tech/images/notes/image-20221121232842418.png" alt="image-20221121232842418" style="zoom:25%;" />

对于HRRF，先计算响应比，确定执行顺序：

作业1最先到达并运行（120 min）；当其完成时，作业2、3、4都已到达，则计算它们的响应比：

+ 作业2响应比为：`1 + 70/30 = 10/3`；
+ 作业3响应比为：`1 + 60/6 = 11`；
+ 作业4响应比为：`1 + 40/12 = 10/3`；

由于作业3响应比最高，所以作业3先运行（6 min），当其完成时，计算作业2、4的响应比：：

+ 作业2响应比为：`1 + 76/30 = 53/15`；
+ 作业4响应比为：`1 + 46/12 = 29/6`；

由于作业4响应比最高，所以作业4先运行（12 min），最后运行作业2。

得到执行顺序`J1 → J3 → J4 → J2`，可得到各个进程的开始执行时间、完成时间、周转时间、带权周转时间：

| 作业 | 到达时间 | 服务时间 | 开始执行时间 | 完成时间 | 周转时间 | 带权周转时间 |
| ---- | -------- | -------- | ------------ | -------- | -------- | ------------ |
| J1   | 8:00     | 2.0      | 8:00         | 10:00    | 120 min  | 1            |
| J2   | 8:50     | 0.5      | 10:18        | 10:48    | 118 min  | 59/15        |
| J3   | 9:00     | 0.1      | 10:00        | 10:06    | 66 min   | 11           |
| J4   | 9:20     | 0.2      | 10:06        | 10:18    | 58 min   | 29/6         |

于是：

<img src="https://images.drshw.tech/images/notes/image-20221121232842418.png" alt="image-20221121232842418" style="zoom:25%;" />

#### FB调度算法

若9个进程A、B、C、D、E、F、G、H、I先后创建，估计运行时间如下表所示：

| 进程 | 开始时间 | 运行时间 | 完成时间 | 周转时间 | 带权周转时间 |
| ---- | -------- | -------- | -------- | -------- | ------------ |
| A    | 0        | 2        |          |          |              |
| B    |          | 6        |          |          |              |
| C    |          | 10       |          |          |              |
| D    |          | 14       |          |          |              |
| E    |          | 18       |          |          |              |
| F    |          | 22       |          |          |              |
| G    |          | 26       |          |          |              |
| H    |          | 30       |          |          |              |
| I    |          | 34       |          |          |              |

若初始队列时间片2分钟，分别设置3个、4个就绪队列（第1级队列大小为2，之后每一级的大小是上一级的2倍），计算每个进程的开始时间和完成时间。

注：一般来讲开始时间与创建时间**不相等**（周转时间 = 结束时间 - 创建时间）；若题目说明“先后创建”，则表示进程都在0时刻创建。

**解答：**

3个就绪队列的情况如下表：

<table>
    <tr>
        <td rowspan="2">
            进程
        </td>
        <td rowspan="2">
        	运行
        </td>
        <td colspan="3">
        	就绪队列1 2m
        </td>
        <td colspan="3">
        	就绪队列2 4m
        </td>
        <td colspan="3">
        	就绪队列3-1 8m
        </td>
        <td colspan="3">
        	就绪队列3-2 8m
        </td>
        <td colspan="3">
        	就绪队列3-3 8m
        </td>
        <td colspan="3">
        	就绪队列3-4 8m
        </td>
    </tr>
    <tr>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
    </tr>
   	<tr>
        <td>
        	A
        </td><td>
        	2
        </td><td>
        	0
        </td><td>
        	2
        </td><td>
        	0
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	B
        </td><td>
        	6
        </td><td>
        	2
        </td><td>
        	4
        </td><td>
        	4
        </td><td>
        	18
		</td><td>
        	22
        </td><td>
        0
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	C
        </td><td>
        	10
        </td><td>
        	4
        </td><td>
        	6
        </td><td>
        	8
        </td><td>
        22
		</td><td>
        26
        </td><td>
        4
        </td><td>
        50
        </td><td>
        54
        </td><td>
        0
        </td><td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	D
        </td><td>
        	14
        </td><td>
        	6
        </td><td>
        	8
        </td><td>
        	12
        </td><td>
        	26
        </td><td>
        30
		</td><td>
        8
        </td><td>
        54
        </td><td>
        62
        </td><td>
        0
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	E
        </td><td>
        	18
        </td><td>
        	8
        </td><td>
        	10
        </td><td>
        	16
        </td><td>
        	30
        </td><td>34
		</td><td>12
        </td><td>62
        </td><td>70
        </td><td>4
        </td><td>102
        </td><td>106
        </td><td>0
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	F
        </td><td>
        	22
        </td><td>
        	10
        </td><td>
        	12
        </td><td>
        	20
        </td><td>
        	34
        </td><td>38
		</td><td>16
        </td><td>70
        </td><td>78
        </td><td>8
        </td><td>106
        </td><td>114
        </td><td>0
        <td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	G
        </td><td>
        	26
        </td><td>
        	12
        </td><td>
        	14
        </td><td>
        	24
        </td><td>
        	38
        </td><td>42
		</td><td>20
        </td><td>78
        </td><td>86
        </td><td>12
        </td><td>114
        </td><td>122
        </td><td>4
        </td><td>138
        </td><td>142
        </td><td>0
        <td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	H
        </td><td>
        	30
        </td><td>
        	14
        </td><td>
        	16
        </td><td>
        	28
        </td><td>
        	42
        </td><td>46
		</td><td>24
        </td><td>86
        </td><td>94
        </td><td>16
        </td><td>122
        </td><td>130
        </td><td>8
        </td><td>142
        </td><td>150
        </td><td>0
        <td>&nbsp;
        </td><td>&nbsp;
        </td><td>&nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	I
        </td><td>
        	34
        </td><td>
        	16
        </td><td>
        	18
        </td><td>
        	32
        </td><td>
        	46
        </td><td>50
		</td><td>28
        </td><td>94
        </td><td>102
        </td><td>20
        </td><td>130
        </td><td>138
        </td><td>12
        </td><td>150
        </td><td>158
        </td><td>4
        </td><td>158
        </td><td>162
        </td><td>0
    </tr>
</table>

4个就绪队列的情况如下表：

<table>
    <tr>
        <td rowspan="2">
            进程
        </td>
        <td rowspan="2">
        	运行
        </td>
        <td colspan="3">
        	就绪队列1 2m
        </td>
        <td colspan="3">
        	就绪队列2 4m
        </td>
        <td colspan="3">
        	就绪队列3 8m
        </td>
        <td colspan="3">
        	就绪队列4-1 16m
        </td>
        <td colspan="3">
        	就绪队列4-2 16m
        </td>
    </tr>
    <tr>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
        <td>
            开始
        </td>
        <td>
            结束
        </td>
        <td>
            剩下
        </td>
    </tr>
   	<tr>
        <td>
        	A
        </td><td>
        	2
        </td><td>
        	0
        </td><td>
        	2
        </td><td>
        	0
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	B
        </td><td>
        	6
        </td><td>
        	2
        </td><td>
        	4
        </td><td>
        	4
        </td><td>
        	18
		</td><td>
        	22
        </td><td>
        0
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	C
        </td><td>
        	10
        </td><td>
        	4
        </td><td>
        	6
        </td><td>
        	8
        </td><td>
        22
		</td><td>
        26
        </td><td>
        4
        </td><td>
        50
        </td><td>
        54
        </td><td>
        0
        </td><td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	D
        </td><td>
        	14
        </td><td>
        	6
        </td><td>
        	8
        </td><td>
        	12
        </td><td>
        	26
        </td><td>
        30
		</td><td>
        8
        </td><td>
        54
        </td><td>
        62
        </td><td>
        0
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	E
        </td><td>
        	18
        </td><td>
        	8
        </td><td>
        	10
        </td><td>
        	16
        </td><td>
        	30
        </td><td>34
		</td><td>12
        </td><td>62
        </td><td>70
        </td><td>4
        </td><td>102
        </td><td>106
        </td><td>0
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	F
        </td><td>
        	22
        </td><td>
        	10
        </td><td>
        	12
        </td><td>
        	20
        </td><td>
        	34
        </td><td>38
		</td><td>16
        </td><td>70
        </td><td>78
        </td><td>8
        </td><td>106
        </td><td>114
        </td><td>0
        </td>
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	G
        </td><td>
        	26
        </td><td>
        	12
        </td><td>
        	14
        </td><td>
        	24
        </td><td>
        	38
        </td><td>42
		</td><td>20
        </td><td>78
        </td><td>86
        </td><td>12
        </td><td>114
        </td><td>126
        </td><td>0
		<td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	H
        </td><td>
        	30
        </td><td>
        	14
        </td><td>
        	16
        </td><td>
        	28
        </td><td>
        	42
        </td><td>46
		</td><td>24
        </td><td>86
        </td><td>94
        </td><td>16
        </td><td>126
        </td><td>142
        </td><td>0
        <td>
        &nbsp;
        </td><td>
        &nbsp;
        </td><td>
        &nbsp;
        </td>
    </tr>
    <tr>
        <td>
        	I
        </td><td>
        	34
        </td><td>
        	16
        </td><td>
        	18
        </td><td>
        	32
        </td><td>
        	46
        </td><td>50
		</td><td>28
        </td><td>94
        </td><td>102
        </td><td>20
        </td><td>142
        </td><td>158
        </td><td>4
        <td>
        158
        </td><td>
        162
        </td><td>
        0
        </td>
    </tr>
</table>

#### 银行家算法

在银行家算法中，若出现下述资源分配情况：

| Process | Allocation | Need | Available |
| ------- | ---------- | ---- | --------- |
| P0      | 0032       | 0012 | 1622      |
| P1      | 1000       | 1750 |           |
| P2      | 1354       | 2356 |           |
| P3      | 0332       | 0652 |           |
| P4      | 0014       | 0656 |           |

试问：

​	(1) 该状态是否安全？

​	(2) 若进程`P2`提出请求`Request(1, 2, 2, 2)`后，系统能否将资源分配给它？

**解答：**

(1) `Need0 = 0012 ≤ Available`，可以分配，更新表：

| Process | Allocation | Need | Available   | isSafe  |
| ------- | ---------- | ---- | ----------- | ------- |
| P0      | 0032       | 0012 | 1622 → 1654 | `True`  |
| P1      | 1000       | 1750 |             | `False` |
| P2      | 1354       | 2356 |             | `False` |
| P3      | 0332       | 0652 |             | `False` |
| P4      | 0014       | 0656 |             | `False` |

`Need1 = 1750 > Available`，不可分配，跳过；

`Need2 = 2356 > Available`，不可分配，跳过；

`Need3 = 0652 ≤ Available`，可以分配，更新表：

| Process | Allocation | Need | Available   | isSafe  |
| ------- | ---------- | ---- | ----------- | ------- |
| P0      | 0032       | 0012 | 1622 → 1654 | `True`  |
| P1      | 1000       | 1750 |             | `False` |
| P2      | 1354       | 2356 |             | `False` |
| P3      | 0332       | 0652 | 1654 → 1986 | `True`  |
| P4      | 0014       | 0656 |             | `False` |

`Need4 = 0656 ≤ Available`，可以分配，更新表：

| Process | Allocation | Need | Available          | isSafe  |
| ------- | ---------- | ---- | ------------------ | ------- |
| P0    | 0032       | 0012 | 1622 → 1654        | `True`  |
| P1    | 1000       | 1750 |                    | `False` |
| P2    | 1354       | 2356 |                    | `False` |
| P3    | 0332       | 0652 | 1654 → 1986        | `True`  |
| P4    | 0014       | 0656 | 1986 →199<u>10</u> | `True`  |

`Need1 = 1750 ≤ Available`，可以分配，更新表：

| Process | Allocation | Need | Available                   | isSafe  |
| ------- | ---------- | ---- | --------------------------- | ------- |
| P0    | 0032       | 0012 | 1622 → 1654                 | `True`  |
| P1    | 1000       | 1750 | 199<u>10</u> → 299<u>10</u> | `True`  |
| P2    | 1354       | 2356 |                             | `False` |
| P3    | 0332       | 0652 | 1654 → 1986                 | `True`  |
| P4    | 0014       | 0656 | 1986 →199<u>10</u>          | `True`  |

`Need2 = 2356 ≤ Available`，可以分配，更新表：

| Process | Allocation | Need | Available                                      | isSafe  |
| ------- | ---------- | ---- | ---------------------------------------------- | ------- |
| P0      | 0032       | 0012 | 1622 → 1654                                    | `True`  |
| P1      | 1000       | 1750 | 199<u>10</u> → 299<u>10</u>                    | `True`  |
| P2      | 1354       | 2356 | 299<u>10</u> → 3 <u>12</u> <u>14</u> <u>10</u> | `False` |
| P3      | 0332       | 0652 | 1654 → 1986                                    | `True`  |
| P4      | 0014       | 0656 | 1986 →199<u>10</u>                             | `True`  |

能找到一个安全序列`P0 → P3 → P4 → P1 → P2`，系统安全。

(2) `Request2 = 1222 ≤ Need2 = 2356 ≤ Available`，可以分配，更新表：

| Process | Allocation  | Need        | Available   | isSafe  |
| ------- | ----------- | ----------- | ----------- | ------- |
| P0      | 0032        | 0012        | 1622        | `True`  |
| P1      | 1000        | 1750        |             | `False` |
| P2      | 1354 → 2576 | 2356 → 1134 | 1622 → 0400 | `True`  |
| P3      | 0332        | 0652        |             | `False` |
| P4      | 0014        | 0656        |             | `False` |

此时`Available = 0400`，小于所有进程的`Need`字段值，系统不安全，不可分配。

### 课后习题

#### T15: 为什么说多级反馈队列调度算法能较好地满足各方面用户的需求？

1. 对终端型作业用户而言，他们提交的作业大多属于交互型作业，作业通常较小，系统只要能使这些作业在第一个队列所规定的时间片内完成，便可使他们都感到满意；
2. 对短批处理作业用户而言，开始时他们的作业像终端型作业一样，如果仅在第一个队列中执行一个时间片即可完成，便可获得与终端型作业一样的响应时间：对于稍长的作业，通常也只需在第二队列和第三队列各执行一个时间片即可完成，其周转时间仍然很短；
3. 对长批处理作业用户而言，他们的作业将依次在第1,2，…，n个队列中运行，然后再按轮转方式运行，用户不必担心其作业长期得不到处理；而且每往下降一个队列，其得到的时间片将随着增加，故可进一步缩短长作业的等待时间。

#### T27: 何谓死锁？产生死锁的原因和必要条件是什么？

1. 死锁是指在并发环境下，各个进程因竞争资源而造成的一种互相等待对方手里的资源，导致各个进程都阻塞，都无法向前推进的现象。发生死锁后若无外力干涉，这些进程都将无法向前推进;
2. 产生原因：竞争不可抢占性资源，竞争可消耗资源，进程推进顺序不当；
3. 必要条件：互斥条件、请求和保持条件、不可抢占条件、环路等待条件。

#### T30: 在银行家算法的例子中，如果`P0`发出的请求向量由`Request(0, 2, 0)`改为`(0, 1, 0)`，问系统可否将资源分配给它？

答：初始表：

| Process | Max  | Allocation | Need | Available |
| ------- | ---- | ---------- | ---- | --------- |
| P0      | 753  | 010        | 743  | 332       |
| P1      | 322  | 200        | 122  |           |
| P2      | 902  | 302        | 600  |           |
| P3      | 222  | 211        | 011  |           |
| P4      | 433  | 002        | 431  |           |

1. `Request0(0, 1, 0) < Need(7, 4, 3)`，此请求合理；

2. `Request0(0, 1, 0)< Available(2, 3, 0)`，此请求可满足；

3. 系统假设可以为`P0`分配资源，并修改相关数据，更新表：

   | Process | Max  | Allocation | Need | Available |
   | ------- | ---- | ---------- | ---- | --------- |
   | P0      | 753  | 020        | 733  | 322       |
   | P1      | 322  | 200        | 122  |           |
   | P2      | 902  | 302        | 600  |           |
   | P3      | 222  | 211        | 011  |           |
   | P4      | 433  | 002        | 431  |           |

4. 利用安全性算法检查，更新表，最终状态如下：

   | Process | Max  | Allocation | Need | Available   | isSafe |
   | ------- | ---- | ---------- | ---- | ----------- | ------ |
   | P1      | 322  | 200        | 122  | 522         | True   |
   | P3      | 533  | 211        | 011  | 733         | True   |
   | P4      | 733  | 002        | 431  | 735         | True   |
   | P0      | 735  | 020        | 733  | 755         | True   |
   | P2      | 755  | 302        | 600  | <u>10</u>57 | True   |

   查找到一个安全序列`{P1, P3, P0, P2, P4}`。因此系统是安全的，可以将`P0`申请的资源进行分配。

#### T31：见[课上习题——银行家算法]()

见课上习题中的[银行家算法](https://docs.drshw.tech/os/3/final/#%E9%93%B6%E8%A1%8C%E5%AE%B6%E7%AE%97%E6%B3%95)。

