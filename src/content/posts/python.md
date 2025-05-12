---
title: "海龟画图"  # 文章标题
pubDate: 2025-05-12        # 发布时间（Date格式）
updatedDate: 2025-05-12     # 更新时间（可选）
tags:                       # 标签数组
  - "阅读记录"
  - "演讲稿"
description: "海龟画图"  # 摘要
cover: "/img/posts-covers/edu.jpg"  # 封面图路径（可选）
---

```
from turtle import *
speed(0)
left(15)
color("red")
pensize(10)
for i in range(150):
    forward(200)
    backward(250)
    forward(50) 
    left(1) 

color("yellow")

for i in range(6):
    for j in range(2):
        for k in range(90):
            forward(1)
            right(1)
        right(90)
    right(60)

done()
```