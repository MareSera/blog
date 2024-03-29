---
title: 递推
date: 2024/03/01
tags: C++
---
> 三月第一更！好耶！

# 递推算法

## 概述

递归是指在函数中调用函数本身的现象。

以阶乘函数为例, 在 factorial 函数中存在着 factorial(n - 1) 的调用，所以此函数是递归函数。

```cpp
int factorial(int n) 
{
    if (n < =1) 
        return 1;
    return n * factorial(n - 1);
}

```

进一步解释递归问题。“递”的意思是将问题拆解成子问题来解决， 子问题再拆解成子子问题，.....，直到被拆解的子问题无需再拆分成更细的子问题（即可以求解），“归”是说最小的子问题解决了，那么它的上一层子问题也就解决了，上一层的子问题解决了，上上层子问题自然也就解决了,....,直到最开始的问题解决,文字说可能有点抽象，那我们就以阶层 f(6) 为例来看下它的“递”和“归”。

![img](https://pic1.zhimg.com/80/v2-780994586a4671713a46344f68705e3c_720w.webp)

求解问题 f(6), 由于 f(6) = n * f(5), 所以 f(6) 需要拆解成 f(5) 子问题进行求解，同理 f(5) = n * f(4) ,也需要进一步拆分,... ,直到 f(1), 这是“递”，f(1) 解决了，由于 f(2) = 2 f(1) = 2 也解决了,.... f(n)到最后也解决了，这是「归」，所以递归的本质是能把问题拆分成具有相同解决思路的子问题，......，直到最后被拆解的子问题再也不能拆分，解决了最小粒度可求解的子问题后，在“归”的过程中自然顺其自然地解决了最开始的问题。

## 递归算法解题思路

根据以上分析，不难发现递归问题有以下特点：

1. 一个问题可分解成具有**相同解决思路**的子问题、子子问题，即这些问题都可**调用同一个函数**。

2. 经过层层分解的子问题最后一定有一个不能再分解的固定值（即终止条件）,如果没有的话就无穷无尽地分解子问题，问题显然是无解的。

解递归题的关键在于我们首先需要根据以上特点判断题目是否可以用递归来解。经判断可以用递归后，接下来看看用递归解题的基本套路：

（1）先定义一个函数，**明确这个函数的功能**，由于递归的特点是问题和子问题都会调用函数自身，所以这个函数的功能一旦确定了， 之后只要找寻问题与子问题的递归关系即可。

（2）接下来寻找问题与子问题间的关系（即**递推公式**），由于问题与子问题具有**相同解决思路**，只要子问题调用步骤 1 定义好的函数，问题即可解决。所谓的关系最好能用一个公式表示出来，比如 `f(n) = n * f(n-)` 这样，如果暂时无法得出明确的公式，用伪代码表示也是可以的, 发现递推关系后，**要寻找最终不可再分解的子问题的解**，即（临界条件），确保子问题不会无限分解下去。由于第一步我们已经定义了这个函数的功能，所以当问题拆分成子问题时，子问题可以调用步骤 1 定义的函数，符合递归的条件（函数里调用自身）。

（3）将第二步的递推公式用代码表示出来补充到步骤 1 定义的函数中。

（4）最后也是很关键的一步，根据问题与子问题的关系，推导出时间复杂度,如果发现递归时间复杂度不可接受，则需**转换思路对其进行改造**，看下是否有更靠谱的解法

## 实例说明

### 输入一个正整数n，输出n!的值。其中n!=123*…*n,即求阶乘

（1）定义这个函数，明确这个函数的功能，我们知道这个函数的功能是求 n 的阶乘, 之后求 `n-1`, `n-2` 的阶乘就可以调用此函数了。

```cpp
int factorial(int n) 
{ }
```
（2）寻找问题与子问题的关系，阶乘关系比较简单， 以 f(n) 来表示 n 的阶乘， 显然 `f(n) = n * f(n - 1)`, 同时临界条件是 `f(1) = 1`。

（3）将第二步的递推公式用代码表示出来补充到步骤 1 定义的函数中。

```cpp
int factorial(int n) {
    // 第二步的临界条件
    if (n < =1) {
        return 1;
    }
    // 第二步的递推公式
    return n * factorial(n-1)
}
```

（4）求时间复杂度 由于 `f(n) = n * f(n-1) = n * (n-1) * .... * f(1)`,总共作了 n 次乘法，所以时间复杂度为 n。

### 一只青蛙可以一次跳 1 级台阶或一次跳 2 级台阶,例如:跳上第 1 级台阶只有一种跳法：直接跳 1 级即可。跳上第 2 级台阶有两种跳法：每次跳 1 级，跳两次；或者一次跳 2 级。问要跳上第 n 级台阶有多少种跳法？

（1）定义一个函数，这个函数代表了跳上 n 级台阶的跳法。

```cpp
public int f(int n) 
{ }
```
（2）寻找问题与子问题之前的关系 这两者之前的关系初看确实看不出什么头绪，但仔细看题目，一只青蛙只能跳一步或两步台阶，**自上而下地思考**，也就是说如果要跳到 n 级台阶只能从 从 `n-1` 或 `n-2` 级跳， 所以问题就转化为跳上 `n-1` 和 `n-2` 级台阶的跳法了，如果 `f(n)` 代表跳到 n 级台阶的跳法，那么从以上分析可得 `f(n) = f(n-1) + f(n-2)`,显然这就是我们要找的问题与子问题的关系,而显然当 n = 1, n = 2， 即跳一二级台阶是问题的最终解。

（3）将第二步的递推公式用代码表示出来补充到步骤 1 定义的函数中 补充后的函数如下

```cpp
int f(int n) 
{
    if (n == 1) return 1;
    if (n == 2) return 2;
    return f(n-1) + f(n-2)；
}
```

（4）计算时间复杂度。斐波那契的时间复杂度计算涉及到高等代数的知识，直接给出结论时间复杂度是指数级别。关于为什么时间复杂度这么大，自习分析可以看到递归过程中有大量的重复计算, f(3) 计算了 3 次， 随着 n 的增大，f(n) 的时间复杂度自然呈指数上升了。

（5）优化

既然有这么多的重复计算，我们可以想到把这些中间计算过的结果保存起来，如果之后的计算中碰到同样需要计算的中间态，直接在这个保存的结果里查询即可，这就是典型的以**空间换时间**,改造后的代码如下：
```cpp
int f(int n) 
{
    if (n == 1) return 1;
    if (n == 2) return 2;
    // map 即保存中间态的键值对， key 为 n，value 即 f(n)
    if (map.get(n)) 
        return map.get(n)
    return f(n-1) + f(n-2)；
}
```

那么改造后的时间复杂度，由于对每一个计算过的 `f(n)` 我们都保存了中间态 ，不存在重复计算的问题，所以时间复杂度是 `O(n)`。但由于用了一个键值对来保存中间的计算结果，所以空间复杂度是 `O(n)`。

（6）进一步优化空间复杂度。使用循环迭代来改造算法 我们在分析问题与子问题关系`（f(n) = f(n-1) + f(n-2)）`的时候用的是**自上向下**的分析方式,但其实我们在解 `f(n)` 的时候可以用自下而上的方式来解决，通过观察我们可以发现以下规律：

```
f(1) = 1
f(2) = 2
f(3) = f(1) + f(2) = 3
f(4) = f(3) + f(2) = 5
....
f(n) = f(n-1) + f(n-2)
```

最底层 f(1), f(2) 的值是确定的，之后的 f(3), f(4) ,...等问题都可以根据前两项求解出来，一直到 f(n)。所以我们的代码可以改造成以下方式：

```cpp
int f(int n) {
    if (n == 1) return 1;
    if (n == 2) return 2;

    int result = 0;
    int pre = 1;
    int next = 2;
    
    for (int i = 3; i < n + 1; i ++) 
   {
        result = pre + next;
        pre = next;
        next = result;
    }
    return result;
}
```

改造后的时间复杂度是` O(n)`, 而由于我们在计算过程中只定义了两个变量`（pre，next）`，所以空间复杂度是`O(1)`。

## 简单总结

分析递归问题时我们需要采用**自上而下**的思维，而解决问题有时候采用**自下而上**的方式能让算法性能得到极大提升。若要熟练掌握还需要进行一些题目的训练才可以。