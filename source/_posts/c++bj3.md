---
abbrlink: ''
categories:
- - cpp
date: '2023-08-02T10:11:50.987381+08:00'
sticky: 1
tags:
- cpp
- 笔记
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
## 函数2
```c++
#include<bits/stdc++.h>
using namespace std;
void show(int geshu){
    int i;
    for(i=1;i<=geshu;i++)
        cout<<"*";
    cout<<endl;
}
int main() {
    int n=4;
    show(1);
    show(2);
    show(n-1);
    show(n);

     return 0;
}
```
## 输入N判断N是不是素数，是就返回true，不是就false
### 优化前 7/10
```c++
#include<bits/stdc++.h>
using namespace std;
bool sushu(int n){
    bool x=0;
    for(int i=2;i<=n;i++)
    {
        if(n%i==0)
            x=false;
        if(n%i!=0)
            x=true;
    }
    return x;
}
int main() {
    int n;
    cin>>n;
    if(sushu(n)==true){
        cout<<"true";
        }
    else{
        cout<<"false";
        }
     return 0;
}
```
### 优化后 10/10
```c++
#include<bits/stdc++.h>
using namespace std;
bool sushu(int n){
    bool x=0;
    if(n%2!=0)
        for(int i=2;i<=sqrt(n);i+=2)
        {
            if(n%i==0)
                return false;
        }
    else if(n==2)
        return true;
        else return false;
    return true;
}
int main() {
    int n;
    cin>>n;
    if(sushu(n)){
        cout<<"是素数";
        }
    else{
        cout<<"不是素数";
        }
     return 0;
}
```
## 输出1~100之间的素数，五个一行
``` c++
#include<bits/stdc++.h>
using namespace std;
bool sushu(int n){
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
int main() {
    int sum;
    for(int i=2;i<=100;i++){
        if(sushu(i)){
            cout<<setw(5)<<i;
            sum++;
            if(sum%5==0){
                cout<<endl;
            }
            }
            
    }
     return 0;
}
```