---
abbrlink: ''
categories:
- - cpp
date: '2023-08-01T10:11:50.987381+08:00'
sticky: 1
tags:
- cpp
title: 8.1-C++学习记录
updated: 2023-7-14T15:59:14.948+8:0
---
## 冒泡排序
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
     int a[11],n;
     for(int i=1;i<=10;i++){
          cin>>a[i];
     }
     for(int j=0;j<9;j++){
          for(int i=10;i>j;i--){
                   if(a[i]<a[i-1])
             {
                   //交换
                   n=a[i];
                   a[i]=a[i-1];//输入：23 19 43 2 45 13 4 7 24 53
                   a[i-1]=n;//输出：2 4 7 13 19 23 24 43 45 53
          }
     }
     for(int i=1;i<=10;i++){
          cout<<a[i]<<" ";
     }
     cout<<endl;
     }
     return 0;

}
```