---
abbrlink: ''
categories:
- - cpp
date: '2023-08-01T10:11:50.987381+08:00'
tags:
- cpp
- 笔记
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
## 数组元素排序
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    int a[11],n,b;
    cin>>n;
    for(int i=1;i<=n;i++){
        cin>>a[i];
    }
    for(int i=1;i<n;i++){
        for(int j=n;j>i;j--){
            if(a[j]<a[j-1]){
                //交换
                b=a[j];
                a[j]=a[j-1];
                a[j-1]=b;
            }
        }
    }
    for(int i=1;i<=n;i++){
        cout<<a[i]<<" ";
    }

     return 0;
}
}
```
## 字符数组
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    char a[2000];
    gets(a);
    for(int i=0;a[i]!='\0';i++)
    {
        cout<<a[i]<<"  ";
    }
    //puts(a);
    cout<<a;

     return 0;
}
```
## 输入英语句子 输出各个小写字母的出现次数
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    char a[2000];
    int count;
    gets(a);
    for(char i='a';i<='z';i++){
        for(int b=0;a[b]!='\0';b++){
            if(a[b]==i)
                count++;
        }
        cout<<i<<":"<<count<<endl;
        count=0;
    }
     return 0;
}
```
## 输入一串字符 判断小写字符
### 优化前
```c++
//输入一串字符 判断小写字符
#include<iostream>
using namespace std;
int main() {
	char a[2000];
    int x=0,i;
    gets(a);
    for(i=0;a[i]!='\0';i++){
        if(a[i]>='a'&&a[i]<='z'){
            x++;
        }
    }
    cout<<x;

     return 0;
}
```
### 优化后
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    char a[2000],m;
    int i=0,b[26]={0};
    gets(a);
    for(i=0;a[i]!='\0';i++){
        if(a[i]>='a'&&a[i]<='z'){
            b[a[i]-'a']++;
        }
    }
    for(i=0;i<26;i++)
    {
        m='a'+i;
        cout<<m<<":"<<b[i]<<endl;
    }

     return 0;
}
```
## 统计字符的个数
[原题](http://82.156.147.155/problem/P1059)
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {
    char a[20];
    int big=0,small=0,math=0;
    cin>>a;
    for(int i=0;a[i]!='#';i++){
        if(a[i]>='a'&&a[i]<='z'){
            small++;
        }
        if(a[i]>='A'&&a[i]<='Z'){
            big++;
        }
        if(a[i]>='0'&&a[i]<='9'){
            math++;
        }
    }
    cout<<big<<" "<<small<<" "<<math;
     return 0;
}
```
## 倒置输出字符串
[原题](http://82.156.147.155/problem/P1105)
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    char a[255]={0};
    cin>>a;
    int i;
    for(int j=0;j<=255;j++)
    {
        if(a[j]=='\0'){
            i=j-1;
            break;
        }
    }
    for(int j=i;j>=0;j--){
        cout<<a[j];
    }
     return 0;
}
```
## 输出小数的位数
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    char ch;
    bool flag=false;
    int count=0;
    while((ch=getchar())!='\n'){
        if(ch>='0'&&ch<='9'){
               if(flag)
            {
               count++;
           }
        }
        if(ch=='.')
        {
            flag=true;
        }
    }
    cout<<count;

     return 0;
}
```
## string and getline
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    string s;
    getline(cin,s);
    for(int i=0;i<s.size();i++){
        cout<<s[i]<<endl;
    }
    //cout<<s;

     return 0;
}
```