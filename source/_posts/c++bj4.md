---
abbrlink: ''
categories:
- - cpp
date: '2023-08-03T10:11:50.987381+08:00'
sticky: 1
tags:
- cpp
- 笔记
title: 8.3-C++学习记录
updated: 2023-7-14T15:59:14.948+8:0
---
## 输出因数个数为3的数
```c++
#include<bits/stdc++.h>
using namespace std;
int s(int n) {
    int sum=0;
    for(int i=1;i<=n;i++){
        if(n%i==0)
            sum++;
    }
    return sum;
}

int main(){
    for(int i=1;i<=100;i++){
        if(s(i)==3){
            cout<<i<<" ";
            }
            
    }
     return 0;
}
```
## 哥德巴赫猜想
[原题](http://82.156.147.155/problem/T1157)
```c++
#include<bits/stdc++.h>
int m,n;
using namespace std;
bool s(int n)
{
    if(n%2!=0)
        for(int i=3;i<=sqrt(n);i+=2)
        {
            if(n%i==0)
                return false;
        }
    else if(n==2)
        return true;
        else return false;
    return true;
}

bool g(int x){
    for(int i=2;i<=x/2;i++){
        if(s(i)&&s(x-i))
        {
            m=i;
            n=x-i;
            return true;
        }
    }
    return false;
}

int main(){
    for(int i=6;i<=100;i+=2){
        if(g(i)){
            cout<<i<<"="<<m<<"+"<<n<<endl;
            }
    }
     return 0;
}
```