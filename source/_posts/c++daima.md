---
title: 集训程序合集
date: 2023-08-28 09:36:44
tags: cpp
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
## 二分法
### 输入：
`2 5 13 24 27 34 38 49 55 66`
`5`
### 输出：
`第2个数`
### 代码：
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    int a[11],n,low,high,mid;
    for(int i=1;i<=10;i++){
        cin>>a[i];
    }
    cin>>n;
    low=1;
    high=10;
    while(low<=high){
        mid=(low+high)/2;
        if(n==a[mid]){
            cout<<"第"<<mid<<"个数";
            break;
            }
        else if(n>a[mid])
                low=mid+1;
            else high=mid-1;
    }//2 5 13 24 27 34 38 49 55 66

     return 0;
}
```
## 二分查找（题库）
### 输入：
`10`
`1 3 5 7 9 11 13 15 17 19`
`3`
### 输出：
`2`
### 程序：
```c++
#include<bits/stdc++.h>
using namespace std;
int main() {

    int a[1000001],n,low,high,mid,x;
    cin>>x;
    for(int i=1;i<=x;i++){
        cin>>a[i];
    }
    cin>>n;
    low=1;
    high=x;
    bool flag=true;
    while(low<=high){
        mid=(low+high)/2;
        if(n==a[mid]){
            cout<<mid;
            flag=false;
            break;
            }
        else if(n>a[mid])
                low=mid+1;
            else high=mid-1;
    }//2 5 13 24 27 34 38 49 55 66
    if(flag) cout<<"-1";

     return 0;
}
```
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
## 挛生素数
[原题](http://82.156.147.155/problem/P1179)
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
        if(s(x)&&s(x+2))
        {
            m=x;
            n=x+2;
            return true;
        }
    return false;
}

int main(){
    int x;
    cin>>x;
    for(int i=2;i<=x;i++){
        if(g(i)){
            cout<<m<<" "<<n<<endl;
            }
    }
     return 0;
}
```
