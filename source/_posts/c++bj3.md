---
abbrlink: ''
categories:
- - cpp
date: '2023-08-02T10:11:50.987381+08:00'
sticky: 1
tags:
- cpp
title: 8.2-C++学习记录
updated: 2023-7-14T15:59:14.948+8:0
---
## 求出N以内的全部素数，并按每行五个数显示
[原题](http://82.156.147.155/problem/P1078)
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    bool a[1001];
    int n;
    cin>>n;
    a[0]=a[1]=false;
    for(int i=2;i<=n;i++)
    {
        a[i]=true;
    }
    int i;
    i=1;
    do{
        i++;
        if(a[i]){
            for(int j=2;j<=n/i;j++){
                a[i*j]=false;
            }
        }
    }while(i<=n);
    int num;
    for(i=1;i<=n;i++){
        if(a[i]){
            cout<<i<<" ";
            num++;
            if(num%5==0) cout<<endl;
        }
    }
    


     return 0;
}```
## 函数
```c++
#include<bits/stdc++.h>
using namespace std;
void show(){
    cout<<"***";
}
int main() {

    show();

     return 0;
}
```