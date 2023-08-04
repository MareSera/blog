---
abbrlink: ''
categories:
- - cpp
date: '2023-08-03T10:11:50.987381+08:00'
sticky: 1
tags:
- cpp
- 笔记
title: 8.4-C++学习记录
updated: 2023-7-14T15:59:14.948+8:0
---
## 挛生素数
```c++
#include<bits/stdc++.h>
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

bool c(int x){
    if(x!=0){
        return true;
    }
    else return false;
}

int main(){
    int count=0,a;
    int i=0;
    do{
        i++;
        cin>>a;
        for(int j=2;j<=a;j++){
            if(s(j)){
            count++;
            }
        }
        if(c(a)){
            cout<<count<<endl;
            count=0;
        }
        else count=0;
    }while(a!=0);
    
     return 0;
}

```
