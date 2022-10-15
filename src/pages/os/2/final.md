---
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

## 本章疑难点

### 为什么程序不能被调度？

因为程序是静态的，程序即使只有一次结果不再现，也是错误的。

要使结果再现，符合并发的要求，需要满足[Berstein条件](https://docs.drshw.tech/os/1/2/#121-%E5%B9%B6%E5%8F%91)，但几乎不可能满足所有指令没有交集，所以一般情况下程序不能并发，也不能被调度。

### 为什么要引入进程？

因为程序不能被调度；而对于进程，它具有可描述进程的基本情况和运行状态的[PCB](https://docs.drshw.tech/os/2/1/#21-%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)，对其进行控制和管理。

### 进程为什么可以实现并发？

因为有PCB。它是动态的过程，且在任何时候中断，信息都会存储在PCB中，不会存在问题。

### 如何实现进程控制？

使用[原语](https://docs.drshw.tech/os/2/2/#222-%E8%BF%9B%E7%A8%8B%E6%8E%A7%E5%88%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%8E%9F%E8%AF%AD)实现。原语是一种特殊的条件，运行不可中断。

### 进程控制相关的原语有哪些？

[进程的创建、终止、阻塞、唤醒、切换](https://docs.drshw.tech/os/2/2/#222-%E8%BF%9B%E7%A8%8B%E6%8E%A7%E5%88%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%8E%9F%E8%AF%AD)。

### 原子操作是什么

原子操作执行过程只能一气呵成，中间不允许被中断。一般使用“[关中断指令](https://docs.drshw.tech/os/2/2/#222-%E8%BF%9B%E7%A8%8B%E6%8E%A7%E5%88%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%8E%9F%E8%AF%AD)”和“开中断指令”这两个[特权指令](https://docs.drshw.tech/os/1/4/#141-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%9A%84%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6)实现原子性。
