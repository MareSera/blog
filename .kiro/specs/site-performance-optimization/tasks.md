# 实施计划：站点性能优化

## 概述

将性能优化设计分解为一系列增量式编码任务，每个任务都在前一个任务的基础上构建，最终将所有优化整合到完整的构建流水线中。

## 任务

- [x] 1. 字体文件转换：TTF → WOFF2
  - 安装 `ttf2woff2` 或使用 `fonttools`（Python）作为转换工具，在 `scripts/convert-fonts.ts` 中实现批量转换逻辑
  - 转换 `public/fonts/` 下所有 TTF 文件，生成对应的 `.woff2` 文件
  - 在 `package.json` 的 `build` 脚本中，在 `astro build` 之前添加字体转换步骤
  - _需求：2.1_

  - [ ]* 1.1 为字体转换脚本编写属性测试
    - **属性 3：字体格式转换正确性**
    - 对任意 TTF 文件，转换后 WOFF2 文件应存在且体积更小
    - **验证：需求 2.1**

- [x] 2. 更新字体引用：将预加载和 @font-face 改为 WOFF2
  - 修改 `src/layouts/BaseLayout.astro` 中的 `<link rel="preload">` 标签，将 `href` 从 `.ttf` 改为 `.woff2`，`type` 改为 `font/woff2`
  - 修改 `src/styles/global.scss` 中所有 `@font-face` 的 `src` 属性，优先使用 WOFF2 格式（`format('woff2')`），保留 TTF 作为回退
  - 确认所有 `@font-face` 规则已包含 `font-display: swap`
  - _需求：2.2、2.3、2.5_

  - [ ]* 2.1 为字体引用格式编写属性测试
    - **属性 4：字体预加载链接格式一致性**
    - **属性 5：font-display 策略全覆盖**
    - 解析生成的 HTML 和 CSS，验证所有字体引用指向 WOFF2 且包含 font-display: swap
    - **验证：需求 2.2、2.5**

- [x] 3. 优化 MagneticCursor 的 RAF 循环
  - 修改 `src/components/MagneticCursor.astro` 中的脚本：
    - 在 `CursorState` 中新增 `lastMoveTime` 和 `isIdle` 字段
    - 在 `onMouseMove` 中记录 `lastMoveTime = Date.now()`，若 `isIdle` 为 true 则重启 RAF
    - 在 `tick()` 中检测 `Date.now() - lastMoveTime > 2000`，超时则设置 `isIdle = true` 并停止 RAF
    - 在初始化时检查 `window.matchMedia('(prefers-reduced-motion: reduce)').matches`，若为 true 则隐藏光标并跳过初始化
    - 在触摸设备检测（`'ontouchstart' in window`）时跳过初始化
  - 修复 `astro:page-load` 事件处理，确保每次页面切换时移除旧的事件监听器再重新绑定
  - _需求：3.3、3.4、3.5、3.6、3.7_

  - [ ]* 3.1 为 MagneticCursor 编写属性测试
    - **属性 6：MagneticCursor RAF 空闲暂停**
    - 模拟鼠标停止移动 2000ms，验证 RAF 停止；再次移动，验证 RAF 重启
    - **验证：需求 3.3、3.4**

  - [ ]* 3.2 为事件监听器清理编写属性测试
    - **属性 7：View Transitions 事件监听器无泄漏**
    - 模拟多次 astro:page-load 事件，验证 mousemove 监听器数量保持为 1
    - **验证：需求 3.6**

- [x] 4. 实现音频文件懒加载
  - 找到音频播放器相关组件（基于 AudioEngine.ts / PlayerManager.ts），将所有 `<audio>` 元素的 `preload` 属性改为 `"none"`
  - 修改播放逻辑：在用户点击播放按钮时，先设置 `audio.src`，再调用 `audio.load()`，然后 `audio.play()`
  - 添加加载状态管理：`idle | loading | loaded | error`，在 `loading` 状态时显示 spinner，在 `error` 状态时显示重试按钮
  - 确保切换曲目时，新曲目仅在用户触发切换后才开始加载
  - _需求：6.1、6.2、6.3、6.4、6.5、6.6_

  - [ ]* 4.1 为音频懒加载编写属性测试
    - **属性 8：音频元素懒加载属性**
    - 解析页面初始 HTML，验证所有 audio 元素 preload="none"
    - **验证：需求 6.1、6.6**

- [x] 5. 将 KaTeX CSS 改为异步加载
  - 修改 `src/components/Header.astro`，将 `import "/node_modules/katex/dist/katex.min.css"` 替换为使用 `media="print" onload="this.media='all'"` 技巧的 `<link>` 标签
  - 添加 `<noscript>` 回退，确保禁用 JS 时 KaTeX 样式仍然加载
  - _需求：4.4_

- [x] 6. 检查点 —— 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户反馈。

- [x] 7. 优化 Astro/Vite 构建配置
  - 修改 `astro.config.mjs`，在 `vite.build` 中添加：
    - `rollupOptions.output.manualChunks`：将 `@swup/astro`、`@pagefind/default-ui`、`katex`、`medium-zoom` 分别打包为独立 vendor chunk
    - `assetsInlineLimit: 4096`：4KB 以下图片内联为 base64
    - `chunkSizeWarningLimit: 100`：超过 100KB 的 chunk 触发警告
  - 安装并配置 `vite-plugin-compression` 或等效插件，生成 Brotli（`.br`）压缩文件
  - _需求：7.1、7.2、7.3、7.4、7.5_

  - [ ]* 7.1 为构建产物结构编写属性测试
    - **属性 9：构建产物包含内容哈希**
    - 扫描 dist/_astro/ 目录，验证所有 JS/CSS 文件名包含内容哈希
    - **验证：需求 7.2**

  - [ ]* 7.2 为 Brotli 压缩产物编写属性测试
    - **属性 10：Brotli 压缩产物存在性**
    - 扫描 dist/ 目录，验证大于 1KB 的 JS/CSS 文件存在对应 .br 文件
    - **验证：需求 7.3**

- [x] 8. 配置 Vercel 缓存策略
  - 修改 `vercel.json`，在 `headers` 字段中添加缓存规则：
    - `/_astro/*` 和 `/fonts/*`：`Cache-Control: public, max-age=31536000, immutable`
    - `/(.*).html`：`Cache-Control: public, max-age=0, must-revalidate`
    - `/audio/*`：`Cache-Control: public, max-age=86400`
    - `/(favicon.ico|robots.txt|sitemap.*)` ：`Cache-Control: public, max-age=3600`
  - _需求：8.1、8.2、8.3、8.4、8.5_

  - [ ]* 8.1 为缓存规则配置编写属性测试
    - **属性 11：缓存规则覆盖完整性**
    - 解析 vercel.json，验证所有必要路径的缓存规则存在且值正确
    - **验证：需求 8.1、8.2、8.3**

- [x] 9. 优化图片加载属性
  - 检查 `src/components/sidebar/ProfileBar.astro` 中的头像 `<Image>` 组件，确认已有 `loading="eager"` 和 `format="webp"`，补充 `fetchpriority="high"`
  - 检查 `src/components/PostCard.astro` 等包含封面图的组件，确保非首屏图片使用 `loading="lazy"`
  - 检查所有使用 `<Image>` 组件的地方，确保都提供了 `width` 和 `height` 属性
  - _需求：1.2、1.3、1.4_

  - [ ]* 9.1 为图片属性完整性编写属性测试
    - **属性 2：图片尺寸属性完整性**
    - 解析生成的 HTML，验证所有 img 标签包含 width 和 height 属性
    - **验证：需求 1.4**

- [x] 10. 添加资源预连接和关键资源预加载
  - 在 `src/components/Header.astro` 中添加 `<link rel="preconnect">` 标签，预连接到实际使用的第三方域名
  - 在 `src/layouts/BaseLayout.astro` 中，为 LCP 候选图片（如首页头像）添加 `<link rel="preload" as="image">` 标签
  - _需求：5.1、5.3_

- [x] 11. 建立性能基准记录文件
  - 在 `docs/performance-baseline.md` 中创建性能指标记录表，包含 LCP、CLS、INP、FCP、TTFB 以及 JS/CSS/字体包大小
  - 在 `scripts/check-performance.ts` 中实现基于 Lighthouse Node.js API 的性能检测脚本
  - 在 `package.json` 中添加 `"perf": "tsx scripts/check-performance.ts"` 脚本
  - _需求：9.1、9.2、9.3、9.4_

- [x] 12. 最终检查点 —— 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户反馈。

## 备注

- 标有 `*` 的子任务为可选测试任务，可跳过以加快 MVP 进度
- 每个任务引用了具体的需求条目以保证可追溯性
- 检查点任务确保增量验证
- 属性测试使用项目已有的 `fast-check` + `vitest` 组合
- 任务 1-5 为运行时优化，任务 7-8 为构建时优化，可并行进行
