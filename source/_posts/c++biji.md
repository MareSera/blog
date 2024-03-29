---
title: CSP-J备战初学笔记（定义 无算法 理解记忆）
date: 2024/02/20
tags: C++
sticky: 3
---
>想要临时抱佛脚+100%背诵内容请看文章👉[CSP-J备战初学（即背即用）](https://blog.maresera.top/2024/02/20/c++bei/)

>进制转化和排序后面我会单独出一或几篇文章，如果你需要请等等

# 数据结构
## 栈
### 栈的定义
**栈（Stack）**：是只允许在一端进行插入或删除的线性表。首先栈是一种线性表，但限定这种线性表只能在某一端进行插入和删除操作。
![定义](/img/c++biji/1.png)

**栈顶（Top）**：线性表允许进行插入删除的那一端。

**栈底（Bottom）**：固定的，不允许进行插入和删除的另一端。

**空栈**：不含任何元素的空表。

**栈又称为后进先出（Last In First Out）的线性表，简称LIFO结构**

### 栈的常见基本操作
 - InitStack(&S)：初始化一个空栈S。
 - StackEmpty(S)：判断一个栈是否为空，若栈为空则返回true，否则返回false。
 - Push(&S, x)：进栈（栈的插入操作），若栈S未满，则将x加入使之成为新栈顶。
 - Pop(&S, &x)：出栈（栈的删除操作），若栈S非空，则弹出栈顶元素，并用x返回。
 - GetTop(S, &x)：读栈顶元素，若栈S非空，则用x返回栈顶元素。
 - DestroyStack(&S)：栈销毁，并释放S占用的存储空间（“&”表示引用调用）。

### 栈的顺序存储

采用顺序存储的栈称为顺序栈，它利用一组地址连续的存储单元存放自栈底到栈顶的数据元素，同时附设一个指针（top）指示当前栈顶元素的位置。
若存储栈的长度为StackSize，则栈顶位置top必须小于StackSize。当栈存在一个元素时，top等于0，因此通常把空栈的判断条件定位top等于-1。

若现在有一个栈，StackSize是5，则栈的普通情况、空栈、满栈的情况分别如下图所示：
![如图所示](/img/c++biji/2.png)

### 共享栈（两栈共享空间）

利用栈底位置相对不变的特征，可让两个顺序栈共享一个一维数组空间，将两个栈的栈底分别设置在共享空间的两端，两个栈顶向共享空间的中间延伸，如下图所示：

![如图所示](/img/c++biji/3.png)

**两个栈的栈顶指针都指向栈顶元素，top0=-1时0号栈为空，top1=MaxSize时1号栈为空；仅当两个栈顶指针相邻（top0+1=top1）时，判断为栈满。当0号栈进栈时top0先加1再赋值，1号栈进栈时top1先减一再赋值出栈时则刚好相反。**

### 栈的链式存储结构
#### 链栈
**采用链式存储的栈称为链栈，链栈的优点是便于多个栈共享存储空间和提高其效率，且不存在栈满上溢的情况。通常采用单链表实现，并规定所有操作都是在单链表的表头进行的。这里规定链栈没有头节点，Lhead指向栈顶元素**，如下图所示：

![如图所示](/img/c++biji/4.png)

**对于空栈来说，链表原定义是头指针指向空，那么链栈的空其实就是top=NULL的时候。**

#### 链栈的基本算法

**（1）链栈的进栈**

对于链栈的进栈push操作，假设元素值为e的新节点是s，top为栈顶指针，示意图如下：

![如图所示](/img/c++biji/5.png)

**链栈的出栈**
链栈的出栈pop操作，也是很简单的三句操作。假设变量p用来存储要删除的栈顶结点，将栈顶指针下移以为，最后释放p即可，如下图所示：


![如图所示](/img/c++biji/6.png)


### 性能分析
**链栈的进栈push和出栈pop操作都很简单，时间复杂度均为O(1)。**


对比一下顺序栈与链栈,它们在时间复杂度上是一样的,均为O(1)。对于空间性能,顺序栈需要事先确定一个固定的长度,可能会存在内存空间浪费的问题,但它的优势是存取时定位很方便,而链栈则要求每个元素都有指针域,这同时也增加了一些内存开销,但对于栈的长度无限制。所以它们的区别和线性表中讨论的一样,**如果栈的使用过程中元素变化不可预料,有时很小,有时非常大,那么最好是用链栈,反之,如果它的变化在可控范围内,建议使用顺序栈会更好一些**

### 栈的应用——递归

#### 1、递归的定义
**递归是一种重要的程序设计方法。简单地说,若在一个函数、过程或数据结构的定义中又应用了它自身,则这个函数、过程或数据结构称为是递归定义的,简称递归。**


它通常把一个大型的复杂问题层层转化为一个与原问题相似的规模较小的问题来求解,递归策略只需少量的代码就可以描述岀解题过程所需要的多次重复计算,大大减少了程序的代码量但在通常情况下,它的效率并不是太高。

#### 2.斐波那契数列
在解释斐波那契数列之前，我们先看经典的兔子繁殖的问题：
>说如果兔子在出生两个月后,就有繁殖能力,一对兔子每个月能生出一对小兔子 来。假设所有兔都不死,那么一年以后可以繁殖多少对兔子呢?
- 第一个月初有一对刚诞生的兔子
- 第二个月之后（第三个月初）它们可以生育
- 每月每对可生育的兔子会诞生下一对新兔子
- 兔子永不死去

我们拿新出生的一对小兔子分析一下:第一个月小兔子没有繁殖能力,所以还是一对;两个月后,生下一对小兔子数共有两对;三个月以后,老兔子又生下一对,因为小兔子还没有繁殖能力,所以一共是三对…依次类推得出这样一个图：

![如图所示](/img/c++biji/7.png)

从这个图可以看出，斐波那契数列数列有一个明显的特点，即：前面两项之和，构成了后一项。

必须注意递归模型不能是循环定义的,其必须满足下面的两个条件

- 递归表达式(递归体)
- 边界条件(递归出口)

递归的精髓在于能否将原始问题转换为属性相同但规模较小的问题

在递归调用的过程中,系统为每一层的返回点、局部变量、传入实参等开辟了递归工作栈来进行数据存储,递归次数过多容易造成栈溢出等。而其效率不高的原因是递归调用过程中包含很多重复的计算。下面以n=5为例,列出递归调用执行过程,如图所示：

![如图所示](/img/c++biji/8.png)

如图可知，程序每往下递归一次，就会把运算结果放到栈中保存，直到程序执行到临界条件，然后便会把保存在栈中的值按照先进后出的顺序一个个返回，最终得出结果。


## 队列
### 基本定义
**队列（queue）是只允许在一端进行插入操作，而在另一端进行删除操作的线性表。**
队列是一种先进先出（First In First Out）的线性表，简称FIFO。允许插入的一端称为队尾，允许删除的一端称为队头。

![如图所示](/img/c++biji/9.png)

- 队头（Front）：允许删除的一端，又称队首。
- 队尾（Rear）：允许插入的一端。
- 空队列：不包含任何元素的空表。

### 队列的常见基本操作

- InitQueue(&Q)：初始化队列，构造一个空队列Q。
- QueueEmpty(Q)：判队列空，若队列Q为空返回true，否则返回false。
- EnQueue(&Q, x)：入队，若队列Q未满，将x加入，使之成为新的队尾。
- DeQueue(&Q, &x)：出队，若队列Q非空，删除队头元素，并用x返回。
- GetHead(Q, &x)：读队头元素，若队列Q非空，则将队头元素赋值给x。

### 队列的顺序存储结构

队列的顺序实现是指分配一块连续的存储单元存放队列中的元素，并附设两个指针：队头指针 front指向队头元素，队尾指针 rear 指向队尾元素的下一个位置。

**(1)顺序队列**

初始状态（队空条件）：`Q->front == Q->rear == 0。`

进队操作：队不满时，先送值到队尾元素，再将队尾指针加1。

出队操作：队不空时，先取队头元素值，再将队头指针加1。

![如图所示](/img/c++biji/10.png)

如图，队列出现“上溢出”，然而却又不是真正的溢出，所以是一种“假溢出”。

**（2）循环队列**

解决假溢出的方法就是后面满了，就再从头开始，也就是头尾相接的循环。我们把队列的这种头尾相接的顺序存储结构称为循环队列。

当队首指针`Q->front = MAXSIZE-1`后，再前进一个位置就自动到0，这可以利用除法取余运算（%）来实现。

- **初始时**：Q->front = Q->rear=0。
- **队首指针进1**：Q->front = (Q->front + 1) % MAXSIZE。
- **队尾指针进1**：Q->rear = (Q->rear + 1) % MAXSIZE。
- **队列长度**：(Q->rear - Q->front + MAXSIZE) % MAXSIZE。

出队入队时，指针都按照顺时针方向前进1，如下图所示：

![如图所示](/img/c++biji/11.png)


那么，循环队列队空和队满的判断条件是什么呢？
显然，队空的条件是 `Q->front == Q->rear` 。若入队元素的速度快于出队元素的速度，则队尾指针很快就会赶上队首指针，如图( d1 ）所示，此时可以看出队满时也有 `Q ->front == Q -> rear `。

为了区分队空还是队满的情况，有三种处理方式：

（1）牺牲一个单元来区分队空和队满，入队时少用一个队列单元，这是种较为普遍的做法，约定以“队头指针在队尾指针的下一位置作为队满的标志”，如图 ( d2 ）所示。

- 队满条件： (Q->rear + 1)%Maxsize == Q->front
- 队空条件仍： Q->front == Q->rear
- 队列中元素的个数： (Q->rear - Q ->front + Maxsize)% Maxsize

（2）类型中增设表示元素个数的数据成员。这样，队空的条件为 `Q->size == O `；队满的条件为 `Q->size == Maxsize` 。这两种情况都有 `Q->front == Q->rear`

（3）类型中增设tag 数据成员，以区分是队满还是队空。tag 等于0时，若因删除导致 `Q->front == Q->rear` ，则为队空；tag 等于 1 时，若因插入导致 `Q ->front == Q->rear` ，则为队满。

### 队列的链式存储结构
#### 链队列

**队列的链式存储结构表示为链队列，它实际上是一个同时带有队头指针和队尾指针的单链表，只不过它只能尾进头出而已。**

![如图所示](/img/c++biji/12.png)

空队列时，front和real都指向头结点。

![如图所示](/img/c++biji/13.png)

### 双端队列

#### 定义

**双端队列是指允许两端都可以进行入队和出队操作的队列**，其元素的逻辑结构仍是线性结构。将队列的两端分别称为前端和后端，两端都可以入队和出队。

在双端队列进队时，前端进的元素排列在队列中后端进的元素的前面，后端进的元素排列在队列中前端进的元素的后面。在双端队列出队时，无论是前端还是后端出队，先出的元素排列在后出的元素的前面。

#### 特殊的双端队列

在实际使用中，根据使用场景的不同，存在某些**特殊的双端队列**。

**输出受限的双端队列**：允许在一端进行插入和删除， 但在另一端只允许插入的双端队列称为输出受限的双端队列

**输入受限的双端队列**：允许在一端进行插入和删除，但在另一端只允许删除的双端队列称为输入受限的双端队列，如下图所示。若限定双端队列从某个端点插入的元素只能从该端点删除，则该双端队列就蜕变为两个栈底相邻接的栈。

## 以上内容参考资料

- 严蔚敏、吴伟民：《数据结构（C语言版）》
- 程杰：《大话数据结构》
- 王道论坛：《数据结构考研复习指导》
- 托马斯·科尔曼等人：《算法导论》


# 前缀、中缀、后缀表达式

它们都是对表达式的记法，因此也被称为前缀记法、中缀记法和后缀记法。它们之间的区别在于运算符相对与操作数的位置不同：前缀表达式的运算符位于与其相关的操作数之前；中缀和后缀同理。


## 中缀表达式（中缀记法）
中缀表达式是一种通用的算术或逻辑公式表示方法，操作符以中缀形式处于操作数的中间。中缀表达式是人们常用的算术表示方法。

虽然人的大脑很容易理解与分析中缀表达式，但对计算机来说中缀表达式却是很复杂的，因此计算表达式的值时，通常需要先将中缀表达式转换为前缀或后缀表达式，然后再进行求值。对计算机来说，计算前缀或后缀表达式的值非常简单。

## 前缀表达式（前缀记法、波兰式）

前缀表达式的运算符位于操作数之前。

## 前缀表达式的计算机求值：

从右至左扫描表达式，遇到数字时，将数字压入堆栈，遇到运算符时，弹出栈顶的两个数，用运算符对它们做相应的计算（栈顶元素 op 次顶元素），并将结果入栈；重复上述过程直到表达式最左端，最后运算得出的值即为表达式的结果。

例如前缀表达式“- × + 3 4 5 6”：

(1) 从右至左扫描，将6、5、4、3压入堆栈；

(2) 遇到+运算符，因此弹出3和4（3为栈顶元素，4为次顶元素，注意与后缀表达式做比较），计算出3+4的值，得7，再将7入栈；

(3) 接下来是×运算符，因此弹出7和5，计算出7×5=35，将35入栈；

(4) 最后是-运算符，计算出35-6的值，即29，由此得出最终结果。

可以看出，用计算机计算前缀表达式的值是很容易的。

## 将中缀表达式转换为前缀表达式：
遵循以下步骤：

(1) 初始化两个栈：运算符栈S1和储存中间结果的栈S2；

(2) 从右至左扫描中缀表达式；

(3) 遇到操作数时，将其压入S2；

(4) 遇到运算符时，比较其与S1栈顶运算符的优先级：

(4-1) 如果S1为空，或栈顶运算符为右括号“)”，则直接将此运算符入栈；

(4-2) 否则，若优先级比栈顶运算符的较高或相等，也将运算符压入S1；

(4-3) 否则，将S1栈顶的运算符弹出并压入到S2中，再次转到

(4-1)与S1中新的栈顶运算符相比较；

(5) 遇到括号时：

(5-1) 如果是右括号“)”，则直接压入S1；

(5-2) 如果是左括号“(”，则依次弹出S1栈顶的运算符，并压入
S2，直到遇到右括号为止，此时将这一对括号丢弃；

(6) 重复步骤(2)至(5)，直到表达式的最左边；

(7) 将S1中剩余的运算符依次弹出并压入S2；

(8) 依次弹出S2中的元素并输出，结果即为中缀表达式对应的前
缀表达式。

例如，将中缀表达式“1+((2+3)×4)-5”转换为前缀表达式的过程如下：

| 扫描到的元素 | S2(栈底->栈顶) | 	S1 (栈底->栈顶) | 说明 |
| --- | --- | --- | --- |
| 5 | 5 | 空 | 数字，直接入栈 |
| - | 5 | - | S1为空，运算符直接入栈 |
| ) | 5 | - ) | 右括号直接入栈 |
| 4 | 5 4 | - ) | 数字直接入栈 |
| × | 5 4 | - ） × | S1栈顶是右括号，直接入栈 |
| ) | 5 4 | - ) × ) | 右括号直接入栈 |
| 3 | 5 4 3 | - ) × ) | 数字 |
| + | 5 4 3 | 	- ) × ) + | S1栈顶是右括号，直接入栈 |
| 2 | 5 4 3 2 | - ) × ) + | 数字 |
| ( | 5 4 3 2 + | - ) × | 左括号，弹出运算符直至遇到右括号 |
| ( | 5 4 3 2 + × | - | 同上 |
| + | 5 4 3 2 + × | - + | 优先级与-相同，入栈 |
| 1 | 5 4 3 2 + × 1 | - + | 数字 |
| 到达最左端 | 5 4 3 2 + × 1 + - | 空 | S1中剩余的运算符 |

因此结果为“- + 1 × + 2 3 4 5”。

## 后缀表达式（后缀记法、逆波兰式）

后缀表达式与前缀表达式类似，只是运算符位于操作数之后。

## 后缀表达式的计算机求值：
与前缀表达式类似，只是顺序是从左至右：

从左至右扫描表达式，遇到数字时，将数字压入堆栈，遇到运算符时，弹出栈顶的两个数，用运算符对它们做相应的计算（次顶元素 op 栈顶元素），并将结果入栈；重复上述过程直到表达式最右端，最后运算得出的值即为表达式的结果。

例如后缀表达式“3 4 + 5 × 6 -”：

(1) 从左至右扫描，将3和4压入堆栈；

(2) 遇到+运算符，因此弹出4和3（4为栈顶元素，3为次顶元素，注意与前缀表达式做比较），计算出3+4的值，得7，再将7入栈；

(3) 将5入栈；

(4) 接下来是×运算符，因此弹出5和7，计算出7×5=35，将35入栈；

(5) 将6入栈；

(6) 最后是-运算符，计算出35-6的值，即29，由此得出最终结果。


## 将中缀表达式转换为后缀表达式：

与转换为前缀表达式相似，遵循以下步骤：
(1) 初始化两个栈：运算符栈S1和储存中间结果的栈S2；

(2) 从左至右扫描中缀表达式；

(3) 遇到操作数时，将其压入S2；

(4) 遇到运算符时，比较其与S1栈顶运算符的优先级：

(4-1) 如果S1为空，或栈顶运算符为左括号“(”，则直接将此运算符入栈；

(4-2) 否则，若优先级比栈顶运算符的高，也将运算符压入S1（注意转换为前缀表达式时是优先级较高或相同，而这里则不包括相同的情况）；

(4-3) 否则，将S1栈顶的运算符弹出并压入到S2中，再次转到(4-1)与S1中新的栈顶运算符相比较；

(5) 遇到括号时：

(5-1) 如果是左括号“(”，则直接压入S1；

(5-2) 如果是右括号“)”，则依次弹出S1栈顶的运算符，并压入S2，直到遇到左括号为止，此时将这一对括号丢弃；

(6) 重复步骤(2)至(5)，直到表达式的最右边；

(7) 将S1中剩余的运算符依次弹出并压入S2;

(8) 依次弹出S2中的元素并输出，结果的逆序即为中缀表达式对应的后缀表达式（转换为前缀表达式时不用逆序）。

例如，将中缀表达式“1+((2+3)×4)-5”转换为后缀表达式的过程如下：
![img](/img/c++biji/14.png)


# 二叉树
## 介绍
### 定义
树是一种数据结构，它是由n（n>=1）个有限节点组成一个具有层次关系的集合。

![img](/img/c++biji/15.png)

把它叫做“树”是因为它看起来像一棵倒挂的树，也就是说它是根朝上，而叶朝下的。它具有以下的特点：

1.每个节点有零个或多个子节点;

2.没有父节点的节点称为根节点;

3.每一个非跟节点有且仅有一个父节点;

4.除了根节点以外，每个子节点可以分为多个不想交的子树。

### 树的基本术语

 若一个节点有子树，那么该节点称为子树根节点的“双亲“，子树的跟是该节点的“孩子”。有相同双亲的节点互为“兄弟节点”。一个节点的所有子树上的任何节点都是该节点的后裔。从根节点到某个节点的路径上的所有节点都是该节点的祖先。


- 节点的度：节点拥有的子树的数目。

- 叶子：度为零的节点。

- 分支节点：度不为零的节点。

- 树的度：树中节点的最大的度。

- 层次：根节点的层次为1，其余节点的层次等于该节点的双亲节点加1。

- 树的高度：树中节点的最大层次。

- 无序数：如果树中节点的各子树之间的次序是不重要的，可以交换位置。

- 有序数：如果树中结点的各子树的次序是重要的，不可以交换位置。

- 森林：0个或多个不相交的树组成。对森林加上一个跟，森林即成为树；删去跟，树即成为森林。

### 相关性质
![img](/img/c++biji/16.png)

## 二叉树的介绍
### 二叉树的定义

二叉树是每个节点最多有两个子树的树结构。它有五种基本形态：二叉树可以是空集；根可以有空的左子树或右子树；活着左、右子树皆为空。

![img](/img/c++biji/17.png)]

### 二叉树与度为2的树的区别
- 度为2的的树必须有三个节点以上(否则就不叫度为二了，一定要先存在)，二叉树可以为空。
- 二叉树的度不一定为2,比如**斜树**。
- 二叉树有左右节点区分，而度为2的树没有左右节点的区分。

### 二叉树的性质

性质1：二叉树第i层上的节点数目最多为 2{i-1} (i≥1)。

性质2：深度为k的二叉树至多有2{k}-1个节点（k>=1）。

性质3：包含n个节点的二叉树的高度至少为log2 (n+1)。

性质4：在任意一颗二叉树中，若终端节点的个数为n0，度为2的节点数为n2，则n0=n2+1。

## 二叉树的种类

### 满二叉树

#### 定义

 高度为h，并且由2{h} –1个结点的二叉树，被称为满二叉树

 ![img](/img/c++biji/18.png)
 ![img](/img/c++biji/19.png)

### 完全二叉树

#### 定义

一颗二叉树中，只有最下面两层节点的度可以小于2，并且最下层的叶节点集中在靠左的若干位置上。

#### 特点
叶子节点只能出现在最下层和次下层，且最下层的叶子节点集中在树的左部。显然，一颗满二叉树必定是一颗完全二叉树，而完全而二叉树不一定是满二叉树。

![img](/img/c++biji/20.png)

![img](/img/c++biji/21.png)

## 二叉树的遍历方式

### 深度优先遍历 

①前序遍历（递归法，迭代法）中左右

②中序遍历（递归法，迭代法）左中右

③后序遍历（递归法，迭代法）左右中

### 广度优先遍历

①层次遍历（迭代法）


### 哈夫曼编码

对叶子节点进行Huffman编码共有两种方式

第一种是从根节点访问到叶子节点

第二种是从叶子节点访问到根节点（叶子节点具有parent数据成员，可以访问到其父节点）。


# 原码、反码、补码

原码、反码、补码是计算机中对数字的二进制表示方法。

## 原码
**将最高位作为符号位**（0表示正，1表示负），其它数字位代表数值本身的**绝对值**的数字表示方式。

简单来说：

**正数**：符号位变成0

**负数**：符号位变成1

## 反码

如果是正数，则表示方法和原码一样；如果是负数，符号位不变，其余各位取反，则得到这个数字的反码表示形式。

正数：符号位变成0

负数：各位取反（x=-1100111则x$[反]$=10011000） 符号位变成1

## 补码

如果是正数，则表示方法和原码一样；如果是负数，则将数字的反码加上1（相当于将原码数值位取反然后在最低位加1）。

正数：符号位变成0

负数：将各位取反+1（x=-1100111则x$[补]$=10011001）  符号位变成1

## 总结

**正数的原码、反码、补码完全一样，只有负数需要按照以上规则计算。**

## ip
三个“.”分成四部分(32个二进制位，八位一存)，每个数字范围：$0-255$（均不会超过）
A：$10.0.0.0-10.255.255.255$
B：$172.16.0.0-172.31.255.255$
C：$192.168.0.0-192.168.255.255$
![img](/img/c++biji/22.png)

# 排列组合

排列：从n个元素中任取m个元素，按照一定的顺序排列起来，叫做m的全排列。

组合：从n个元素中任取m个元素为一组，m个数的组合。

**注意： 排列有序，组合无序。**

例：从$[1,2,3]$三个元素中任取两个元素进行排列组合：

排列的结果：$[1,2] 、[1,3]、[2,1]、[2,3]、[3,1]、[3,2]$

组合的结果：$[1,2]、[1,3]、[2,3]$

# 图

## 定义
图（graph）是数据结构和算法学中最强大的框架之一（或许没有之一）。图几乎可以用来表现所有类型的结构或系统，从交通网络到通信网络，从下棋游戏到最优流程，从任务分配到人际交互网络，图都有广阔的用武之地。


而要进入图论的世界，清晰、准确的基本概念是必须的前提和基础。下面对其最核心和最重要的概念作出说明。关于图论的概念异乎寻常的多，先掌握下面最核心最重要的，足够开展一些工作了，其它的再到实践中不断去理解和熟悉吧。


图（graph）并不是指图形图像（image）或地图（map）。通常来说，我们会把图视为一种由“顶点”组成的抽象网络，网络中的各顶点可以通过“边”实现彼此的连接，表示两顶点有关联。注意上面图定义中的两个关键字，由此得到我们最基础最基本的2个概念，顶点（vertex）和边（edge）。

![img](/img/c++biji/23.png)

## 顶点（vertex）

上图中黑色的带数字的点就是顶点，表示某个事物或对象。由于图的术语没有标准化，因此，称顶点为点、节点、结点、端点等都是可以的。叫什么无所谓，理解是什么才是关键。

## 边（edge）

上图中顶点之间蓝色的线条就是边，表示事物与事物之间的关系。需要注意的是边表示的是顶点之间的逻辑关系，粗细长短都无所谓的。包括上面的顶点也一样，表示逻辑事物或对象，画的时候大小形状都无所谓。

## 同构（Isomorphism ）

![img](/img/c++biji/24.png)

![img](/img/c++biji/25.png)

首先你的感觉是这2个图肯定不一样。但从图（graph）的角度出发，这2个图是一样的，即它们是同构的。前面提到顶点和边指的是事物和事物的逻辑关系，不管顶点的位置在哪，边的粗细长短如何，只要不改变顶点代表的事物本身，不改变顶点之间的逻辑关系，那么就代表这些图拥有相同的信息，是同一个图。同构的图区别仅在于画法不同。

## 有向/无向图（Directed Graph/ Undirected Graph）

最基本的图通常被定义为“无向图”，与之对应的则被称为“有向图”。两者唯一的区别在于，有向图中的边是有方向性的。下图即是一个有向图，边的方向分别是：(1->2), (1-> 3), (3-> 1), (1->5), (2->3), (3->4), (3->5), (4->5), (1->6), (4->6)。要注意，图中的边(1->3)和(3->1)是不同的。有向图和无向图的许多原理和算法是相通的。

![img](/img/c++biji/26.png)

## 权重（weight）

边的权重（或者称为权值、开销、长度等），也是一个非常核心的概念，即每条边都有与之对应的值。例如当顶点代表某些物理地点时，两个顶点间边的权重可以设置为路网中的开车距离。

下图中顶点为4个城市:Beijing, Shanghai, Wuhan, Guangzhou，边的权重设置为2城市之间的开车距离。有时候为了应对特殊情况，边的权重可以是零或者负数，也别忘了“图”是用来记录关联的东西，并不是真正的地图。

![img](/img/c++biji/27.png)

## 路径/最短路径（path/shortest path）

在图上任取两顶点，分别作为起点（start vertex）和终点（end vertex），我们可以规划许多条由起点到终点的路线。不会来来回回绕圈子、不会重复经过同一个点和同一条边的路线，就是一条“路径”。两点之间存在路径，则称这2个顶点是连通的（connected）。

还是上图的例子，北京->上海->广州，是一条路径，北京->武汉->广州，是另一条路径，北京—>武汉->上海->广州，也是一条路径。而北京->武汉->广州这条路径最短，称为最短路径。

路径也有权重。路径经过的每一条边，沿路加权重，权重总和就是路径的权重（通常只加边的权重，而不考虑顶点的权重）。在路网中，路径的权重，可以想象成路径的总长度。在有向图中，路径还必须跟随边的方向。

值得注意的是，一条路径包含了顶点和边，因此路径本身也构成了图结构，只不过是一种特殊的图结构。

## 环（loop）

环，也成为环路，是一个与路径相似的概念。在路径的终点添加一条指向起点的边，就构成一条环路。通俗点说就是绕圈。

![img](/img/c++biji/28.png)

上图中，北京->上海->武汉->广州->北京，就是一个环路。北京->武汉->上海->北京，也是一个环路。与路径一样，有向图中的环路也必须跟随边的方向。环本身也是一种特殊的图结构。

## 连通图/连通分量（connected graph/connected component）

如果在图G中，任意2个顶点之间都存在路径，那么称G为连通图（注意是任意2顶点）。上面那张城市之间的图，每个城市之间都有路径，因此是连通图。而下面这张图中，顶点8和顶点2之间就不存在路径，因此下图不是一个连通图，当然该图中还有很多顶点之间不存在路径。

![img](/img/c++biji/29.png)

上图虽然不是一个连通图，但它有多个连通子图：0,1,2顶点构成一个连通子图，0,1,2,3,4顶点构成的子图是连通图，6,7,8,9顶点构成的子图也是连通图，当然还有很多子图。我们把一个图的最大连通子图称为它的连通分量。0,1,2,3,4顶点构成的子图就是该图的最大连通子图，也就是连通分量。连通分量有如下特点：
1）是子图；
2）子图是连通的；
3）子图含有最大顶点数。
注意：“最大连通子图”指的是无法再扩展了，不能包含更多顶点和边的子图。0,1,2,3,4顶点构成的子图已经无法再扩展了。
显然，对于连通图来说，它的最大连通子图就是其本身，连通分量也是其本身。

# 最小生成树——Prim算法

## 最小生成树的概念 

在一给定的无向图G = (V, E) 中，(u, v) 代表连接顶点 u 与顶点 v 的边，而 w(u, v) 代表此的边权重，若存在 T 为 E 的子集（即）且为无循环图，使得的 w(T) 最小，**则此 T 为 G 的最小生成树**。最小生成树其实是**最小权重生成树的简称**。（简而言之就是把一个图变成一棵树，并且树中的边权和最小）

![img](/img/c++biji/30.png)

## prim算法简介 

prim算法基于贪心，我们每次总是选出一个离生成树距离最小的点去加入生成树，最后实现最小生成树（不做证明，理解思想即可） 

## prim算法解析 （详细图解）

![img](/img/c++biji/31.png)

（随机构建一个无向图） 

- 现在我们构建两个集合S（红色的点），V（蓝色的点），S集合中存放的是已近加入最小生成树的点，V集合中存放的是还没有加入最小生成树的点。显然刚开始时所有的点都在V集合中。
- 然后们先将任意一个点加入集合S中（默认为点1），并且初始化所有点（除了点1）到集合S的距离是无穷大。


![img](/img/c++biji/32.png)
![img](/img/c++biji/33.png)

- 用一个变量res存放最小生成树所有边权值的和。我们每次都选择离S集合最近的点加入S集合中，并且用新加入的点去更新dist数组，因为只有一个新的点加入到集合S中，到集合S的距离才有可能更新（贪心，每次都选最小的）。
- 更新就是看一下能否通过新加入的点使到达集合的距离变小（看下面dist数组的变化）。
- 我们开始在加入点1后开始第一次更新。

（下方为gif动图）

![img](/img/c++biji/1.gif)

现在集合S={1}，集合V={2，3，4，5，6，7}，根据贪心策略，我们选择离集合S最近的点加入 ，即点2，并把这一条边的权值加到res中。

![img](/img/c++biji/34.png)

集合更新为S={1，2}，V={3，4，5，6，7}，并用点2去更新dist数组，我们发现点3和点7都可以都可以通过边2-3，2-7缩短到集合S得距离。

（下方为gif动图）

![img](/img/c++biji/2.gif)

重复上面的步骤，直到将全部的点加入到最小生成树中。 

![img](/img/c++biji/35.png)

![img](/img/c++biji/36.png)

![img](/img/c++biji/37.png)

3并不能更新任何点 

![img](/img/c++biji/38.png)

![img](/img/c++biji/39.png)

![img](/img/c++biji/40.png)

![img](/img/c++biji/41.png)

![img](/img/c++biji/42.png)

![img](/img/c++biji/43.png)

这样一颗最小生成树就构建完成了，权值和是57。 


>太棒了 笔记终于写完了qwq