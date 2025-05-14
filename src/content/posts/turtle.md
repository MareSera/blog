---
title: "海龟画图"  # 文章标题
pubDate: 2025-05-12        # 发布时间（Date格式）
updatedDate: 2025-05-12     # 更新时间（可选）
tags:                       # 标签数组
  - "海龟画图"
description: "海龟画图"  # 摘要
cover: "/img/posts-covers/edu.jpg"  # 封面图路径（可选）
---

> 本文章用于帮助我的同学，无实际意义

## 1

![](/img/turtle/1.png)

``` py
from turtle import *
speed(0)
color("navy")
for i in range(200):
    forward(i*2)
    backward(i*2)
    right(89)

done()

```

## 2
![](/img/turtle/2.png)
``` py
from turtle import *
speed(0)
pensize(3)
colors = ["#FF6B6B", "#4ECDC4"]
for i in range(36):
    color(colors[i%2])
    circle(150)
    left(10)

for _ in range(8):
    color("#FFE66D")
    forward(200)
    backward(200)
    left(45)
done()
```

## 3
![](/img/turtle/3.png)
``` py
from turtle import *
speed(0)
left(30)
pensize(4)
for _ in range(12):
    color("steelblue")
    forward(100)
    right(30)
    circle(20, 180)
    left(30)
    backward(100)
    right(30)


done()
```

## 4
![](/img/turtle/4.png)
``` py
from turtle import *
speed(0)
colormode(255)
for i in range(500):
    pencolor(255-i//2, i//2, 150)
    forward(i)
    right(91)
done()

```
## 5

![](/img/turtle/5.png)
``` py
from turtle import *
speed(0)
colormode(255)
bgcolor("black")
for i in range(150):
    pencolor(0, 255-i*2, i*2)
    for _ in range(4):
        forward(i*2)
        left(90)
    left(5)
done()

```

## 6

![](/img/turtle/6.png)

``` py
from turtle import *
speed(0)
def tree(size, level):
    if level > 0:
        color("#"+hex(0x555500 + level*0x1010)[2:])
        pensize(level)
        forward(size)
        right(20)
        tree(size*0.8, level-1)
        left(40)
        tree(size*0.8, level-1)
        right(20)
        backward(size)
left(90)
penup()
backward(100)
pendown()
tree(80, 8)
done()

```

## 7
![](/img/turtle/7.png)
``` py
from turtle import *
import math
speed(0); tracer(0,0)
def project(point):
    fov = 300  # 焦距参数
    z = 1/(3 - point[2]/fov)  # 透视投影
    return point[0]*z, point[1]*z
def cube(x,y,z,s):
    vertices = [(x+s,y+s,z+s),(x-s,y+s,z+s),(x-s,y-s,z+s),(x+s,y-s,z+s),
                (x+s,y+s,z-s),(x-s,y+s,z-s),(x-s,y-s,z-s),(x+s,y-s,z-s)]
    edges = [(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,7),(7,4),
             (0,4),(1,5),(2,6),(3,7)]
    for a,b in edges:
        pu(); goto(*project(vertices[a]))
        pd(); goto(*project(vertices[b]))
for angle in range(0, 360, 3):
    clear(); setheading(angle)
    for i in range(-2,3,2):
        cube(i*80, 0, 0, 30 + abs(i)*10)
    update()
done()

```

