---
abbrlink: ''
categories:
- - cpp
date: '2023-07-31T10:11:50.987381+08:00'
tags:
- cpp
- 笔记
title: 7.31-C++程序备份
updated: 2023-7-14T15:59:14.948+8:0
---
## 开关门
```c++
#include<bits/stdc++.h>
using namespace std;
int main()
{
    bool door[97]={0};
    int n;
    for(int i=1;i<=42;i++)
    {
        for(int j=i;j<=96;j+=i)
        {
            door[j]=!door[j];
        }
    }

    for(int i=1;i<=96;i++)
    {
        if(door[i])
            {
            n++;
            }
    }
    cout<<n;
    return 0;

}
```
## 山洞捉迷藏
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
    bool a[10]={0};
    int n=1,i=0;
    a[0]=true;
    for(int j=0;j<1000;j++)
    {
        i=(i+n)%10;
        a[i]=true;
        n++;//1 2 3 4 5 6 7 8 9 10
    }
    for(int j=0;j<10;j++)
    {
        if(a[j]==false)
            cout<<j<<endl;
    }
    return 0;
}
```

## 十个数输出最大值
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
    int a[10],max=0;
    for(int i=1;i<=10;i++)
    {
        cin>>a[i];
     }

    for(int i=1;i<=10;i++)
    {
        if(a[i]>max)
            max=a[i];
    }
    cout<<max;
     return 0;

}//3 56 14 87 25 16 23 45 67 7
```
## 循环移位
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
    int a[6]={0,1,2,3,4,5},i,j;
    for(j=1;j<=5;j++){
        for(i=0;i<=4;i++)
        {
            a[i]=a[i+1];
        }
        a[5]=a[0];
        cout<<j<<": ";
        for(i=1;i<=5;i++)
        {
            cout<<a[i]<<" ";
        }
        cout<<endl;
    }

     return 0;

}
```
## 移动数组元素
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
    //定义变量和数组
    int x,a[101],min,max,m,n,b;

    //输入
    cin>>x;
    for(int i=1;i<=x;i++)
    {
        cin>>a[i];
    }

    //定义min和max的初始值
    min=a[1];
    max=a[1];

    //判断数组中的最大值和最小值
    for(int j=2;j<=x;j++)
    {
        if(a[j]>max)

        {
            max=a[j];
            m=j;
        }
        if(a[j]<min)
        {
            min=a[j];
            n=j;
        }
    }

    //将最小值和第一个数交换
    b=min;
    a[n]=a[1];
    a[1]=b;

    //将最大值和最后一个数交换
    b=max;
    a[m]=a[x];
    a[x]=b;

    //输出交换完的数
    for(int i=1;i<=x;i++)
    {
    cout<<a[i]<<" ";
    }
     return 0;
}
```
7.31