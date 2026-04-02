# 性能基准记录

本文档记录站点性能优化前后的各项指标数值。

## Core Web Vitals

| 指标 | 说明 | 优化前 | 优化后 | 变化 |
|------|------|--------|--------|------|
| LCP  | Largest Contentful Paint（最大内容绘制） | - | - | - |
| CLS  | Cumulative Layout Shift（累积布局偏移） | - | - | - |
| INP  | Interaction to Next Paint（交互到下一次绘制） | - | - | - |
| FCP  | First Contentful Paint（首次内容绘制） | - | - | - |
| TTFB | Time to First Byte（首字节时间） | - | - | - |

## 资源大小

| 资源 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| JS Bundle（总计） | - | - | - |
| CSS Bundle（总计） | - | - | - |
| Delius-Regular（字体） | 75.7 KB (TTF) | 26.7 KB (WOFF2) | -64.7% |
| DynaPuffCondensed-Medium（字体） | 130.4 KB (TTF) | 51.4 KB (WOFF2) | -60.5% |
| KeinannMaruPOPjp（字体） | 9870.9 KB (TTF) | 3620.3 KB (WOFF2) | -63.3% |
| KeinannMaruPOP（字体） | - KB (TTF) | - KB (WOFF2) | - |
| RawMarukoGothicCJKtc（字体） | - KB (TTF) | - KB (WOFF2) | - |

## 优化措施清单

| 优化项 | 状态 | 说明 |
|--------|------|------|
| 字体 TTF → WOFF2 转换 | ✅ 完成 | 平均压缩率约 63% |
| 字体预加载改为 WOFF2 | ✅ 完成 | `<link rel="preload" type="font/woff2">` |
| @font-face 优先 WOFF2 | ✅ 完成 | 保留 TTF 作为回退 |
| MagneticCursor RAF 空闲暂停 | ✅ 完成 | 2 秒无移动自动暂停 |
| MagneticCursor prefers-reduced-motion | ✅ 完成 | 减少动效时完全禁用 |
| MagneticCursor 触摸设备跳过 | ✅ 完成 | 移动端不初始化 |
| MagneticCursor 事件监听器清理 | ✅ 完成 | View Transitions 无泄漏 |
| 音频懒加载（preload="none"） | ✅ 完成 | 点击播放时才加载 |
| KaTeX CSS 异步加载 | ✅ 完成 | `media="print" onload` 技巧 |
| Vite manualChunks 代码分割 | ✅ 完成 | katex/medium-zoom/swup 独立 chunk |
| assetsInlineLimit 4KB | ✅ 完成 | 小图内联为 base64 |
| Brotli 压缩（.br 文件） | ✅ 完成 | vite-plugin-compression2 |
| Vercel 缓存头配置 | ✅ 完成 | 静态资源 1 年，HTML 不缓存 |
| 头像 fetchpriority="high" | ✅ 完成 | LCP 候选图片优先加载 |
| PostCard 封面图 loading="lazy" | ✅ 完成 | 非首屏图片延迟加载 |
| 资源预连接（preconnect） | ✅ 完成 | github.com / api.github.com / unpkg.com |
| LCP 图片预加载 | ✅ 完成 | `<link rel="preload" as="image">` |

## 如何运行性能测试

```bash
# 构建站点
pnpm build

# 运行性能检测脚本（需要先启动本地服务器）
pnpm preview &
pnpm perf
```

## 参考资料

- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
