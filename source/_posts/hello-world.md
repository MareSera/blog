---
abbrlink: ''
categories:
- - 搬运
date: '2023-07-14T10:11:50.987381+08:00'
tags:
- 搬运
title: # [搬运/自留]为你的博客安装上便携小空调
updated: 2023-7-14T15:59:14.948+8:0
---
> 以下内容均搬运自[安知鱼 - 生活明朗, 万物可爱](https://blog.anheyu.com/posts/d335.html)

# 部署方案

如果你和我一样是使用 hexo 的话，那么将变的极其简单。

在你的博客根目录执行以下命令:

```bash
hexo new page air-conditioner
```

然后在会生成`source/air-conditioner/index.md`, 将以下内容替换原内容

```markdown
---
title: 便携小空调 - 为你的夏日带去清凉!
date: 2022-10-20 22:06:17
comments: true
aside: false
top_img: false
---

> 终于为博客安装上了便携小空调

<style>
.copyright-box a {
  border-bottom: none !important;
  padding: 0 !important;
}
</style>

<div id="air-conditioner-vue"></div>
<script defer data-pjax src='https://npm.elemecdn.com/anzhiyu-air-conditioner@1.0.1/index.3f125bc6.js'></script>
```

然后访问`https://你的博客域名/air-conditioner`就可以得到一个没有风的空调 ❄️

# 其他部署方案

如果你使用的是其他的，部署也一样简单，只需加入以下代码嵌入网站即可

```html
<iframe height="740" src="https://loquacious-bienenstitch-58539b.netlify.app/"></iframe>
```

# 自行构建部署

1. 进入 [https://github.com/anzhiyu-c/air-conditioner-vue](https://github.com/anzhiyu-c/air-conditioner-vue)
2. 点击项目右上角的 `fork 叉子`
3. 进入 [vercel](https://vercel.com/) 或 [netlify](https://app.netlify.com/)
4. 部署项目 选择仓库时选择刚刚 fork 的仓库然后 点击 `deploy` 即可。
