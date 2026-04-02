# 需求文档

## 简介

本文档描述对基于 Astro 框架的个人博客网站（Frosti 主题）进行全面性能优化的需求。优化目标是在不改变任何现有功能和视觉效果的前提下，通过图片优化、字体加载优化、JavaScript 优化、CSS 优化、资源预加载策略、音频懒加载、组件级优化以及构建配置调整，显著提升网站的 Core Web Vitals 指标（LCP、CLS、INP/FID）和整体加载速度。

## 词汇表

- **Site**：整个 Astro 博客网站系统
- **ImageOptimizer**：负责图片格式转换、懒加载和尺寸优化的模块
- **FontLoader**：负责字体子集化和加载策略的模块
- **AudioPlayer**：音乐播放器组件，包含 AudioEngine.ts 和 PlayerManager.ts
- **MagneticCursor**：磁性光标组件（MagneticCursor.astro）
- **BuildPipeline**：Astro 构建流水线及相关 Vite 配置
- **CacheStrategy**：HTTP 缓存头和资源版本化策略
- **CriticalCSS**：首屏渲染所必需的最小 CSS 集合
- **LCP**：Largest Contentful Paint，最大内容绘制时间
- **CLS**：Cumulative Layout Shift，累积布局偏移
- **INP**：Interaction to Next Paint，交互到下一次绘制
- **RAF**：requestAnimationFrame，浏览器动画帧回调
- **TTF**：TrueType Font，字体文件格式
- **WOFF2**：Web Open Font Format 2，网页字体压缩格式

---

## 需求

### 需求 1：图片格式现代化与懒加载

**用户故事：** 作为网站访客，我希望图片能快速加载，以便在低带宽环境下也能流畅浏览博客内容。

#### 验收标准

1. WHEN 页面包含 `<img>` 标签或 Astro `<Image>` 组件时，THE ImageOptimizer SHALL 将图片输出为 WebP 或 AVIF 格式（优先 AVIF，回退 WebP）
2. WHEN 图片位于首屏可视区域之外时，THE ImageOptimizer SHALL 为该图片添加 `loading="lazy"` 属性
3. WHEN 图片位于首屏可视区域内（如头像、封面图）时，THE ImageOptimizer SHALL 为该图片保留 `loading="eager"` 并添加 `fetchpriority="high"` 属性
4. WHEN 使用 Astro `<Image>` 组件渲染图片时，THE ImageOptimizer SHALL 同时输出 `width` 和 `height` 属性以防止 CLS
5. WHEN `public/img/` 目录下存在 PNG/JPG/JPEG 图片时，THE ImageOptimizer SHALL 在构建时生成对应的 WebP 版本
6. IF 图片文件不存在或路径错误，THEN THE ImageOptimizer SHALL 保留原始 `<img>` 标签并记录警告，不中断构建

---

### 需求 2：字体加载优化

**用户故事：** 作为网站访客，我希望页面文字能立即显示（即使使用备用字体），以便减少等待时间和布局抖动。

#### 验收标准

1. THE FontLoader SHALL 将所有 TTF 格式字体文件转换为 WOFF2 格式以减少文件体积
2. WHEN 浏览器加载页面时，THE FontLoader SHALL 对所有自定义字体使用 `font-display: swap` 策略，确保文字立即以备用字体显示
3. WHEN 页面 `<head>` 渲染时，THE FontLoader SHALL 通过 `<link rel="preload">` 预加载关键字体（Delius 和 RawMarukoGothicCJKtc）
4. WHERE 中文字体（RawMarukoGothicCJKtc）体积超过 1MB 时，THE FontLoader SHALL 通过 `unicode-range` 描述符限制字体仅加载页面实际使用的字符范围
5. WHEN 字体文件通过 `<link rel="preload">` 预加载时，THE FontLoader SHALL 使用 WOFF2 格式的 `href` 而非 TTF 格式
6. IF 字体文件加载失败，THEN THE FontLoader SHALL 回退到系统字体栈，页面布局不得崩溃

---

### 需求 3：JavaScript 优化与主线程减负

**用户故事：** 作为网站访客，我希望页面交互响应迅速，以便在点击链接或按钮时不感到卡顿。

#### 验收标准

1. WHEN 非关键 JavaScript 模块（如评论组件、搜索组件）被引用时，THE BuildPipeline SHALL 对其应用动态 `import()` 实现代码分割
2. WHEN 页面加载时，THE BuildPipeline SHALL 确保非首屏交互所需的脚本使用 `defer` 或 `async` 属性加载
3. WHEN MagneticCursor 的 `tick()` 函数执行时，THE MagneticCursor SHALL 仅在鼠标位置或目标元素发生实际变化时才调用 `requestAnimationFrame` 进行下一帧更新
4. WHEN 用户未移动鼠标超过 2 秒时，THE MagneticCursor SHALL 暂停 RAF 循环以释放主线程资源
5. WHEN 用户设备的 `prefers-reduced-motion` 媒体查询为 `reduce` 时，THE MagneticCursor SHALL 完全禁用动画并隐藏光标元素
6. WHEN 页面通过 Astro View Transitions 切换时，THE MagneticCursor SHALL 正确清理旧页面的事件监听器并在新页面重新初始化，不产生内存泄漏
7. IF 浏览器不支持 `requestAnimationFrame`，THEN THE MagneticCursor SHALL 降级为不显示自定义光标，恢复默认系统光标

---

### 需求 4：CSS 优化

**用户故事：** 作为网站访客，我希望页面能快速完成首次渲染，以便尽早看到内容而不是空白屏幕。

#### 验收标准

1. WHEN 页面 `<head>` 渲染时，THE BuildPipeline SHALL 将首屏渲染所需的关键 CSS（主题变量、布局骨架）内联到 `<style>` 标签中
2. WHEN 构建完成时，THE BuildPipeline SHALL 通过 `@playform/compress` 集成对所有 CSS 文件进行压缩和去重
3. WHEN Tailwind CSS 构建时，THE BuildPipeline SHALL 启用 PurgeCSS/Tree-shaking 仅保留实际使用的 CSS 类
4. WHEN 非关键 CSS（如 KaTeX 数学公式样式）被引用时，THE BuildPipeline SHALL 将其改为异步加载，不阻塞首屏渲染
5. IF CSS 文件加载失败，THEN THE Site SHALL 保持基本可读的布局，不出现完全无样式的内容

---

### 需求 5：资源预加载与预连接策略

**用户故事：** 作为网站访客，我希望导航到新页面时能快速加载，以便减少等待时间。

#### 验收标准

1. WHEN 页面 `<head>` 渲染时，THE Site SHALL 通过 `<link rel="preconnect">` 预连接到所有第三方资源域名（如 CDN、字体服务）
2. WHEN Astro 的 `prefetch` 配置启用时，THE Site SHALL 对视口内的内部链接使用 `viewport` 策略进行预取，对悬停链接使用 `hover` 策略
3. WHEN 页面包含关键图片（LCP 候选元素）时，THE Site SHALL 通过 `<link rel="preload" as="image">` 预加载该图片
4. WHEN 页面包含关键脚本时，THE Site SHALL 通过 `<link rel="modulepreload">` 预加载关键 ES 模块
5. IF 预取的页面资源超过用户数据配额（`Save-Data` 请求头为 `on`），THEN THE Site SHALL 禁用自动预取功能

---

### 需求 6：音频文件懒加载

**用户故事：** 作为网站访客，我希望音乐播放器不影响页面初始加载速度，以便在不使用播放器时不消耗额外带宽。

#### 验收标准

1. WHEN 页面初始加载时，THE AudioPlayer SHALL 不预加载任何音频文件，音频元素的 `preload` 属性应设置为 `none`
2. WHEN 用户首次点击播放按钮时，THE AudioPlayer SHALL 开始加载对应的音频文件
3. WHEN 音频文件正在加载时，THE AudioPlayer SHALL 显示加载状态指示器，不阻塞 UI 交互
4. WHEN 音频文件加载完成时，THE AudioPlayer SHALL 自动开始播放，加载状态指示器消失
5. IF 音频文件加载失败，THEN THE AudioPlayer SHALL 显示错误提示并允许用户重试，不崩溃页面
6. WHEN 用户切换曲目时，THE AudioPlayer SHALL 仅在用户触发切换操作后才开始加载新曲目

---

### 需求 7：Astro 构建配置优化

**用户故事：** 作为开发者，我希望构建产物尽可能小且高效，以便减少服务器带宽消耗和用户下载量。

#### 验收标准

1. WHEN 执行 `pnpm build` 时，THE BuildPipeline SHALL 启用 Vite 的代码分割（`manualChunks`）将第三方库与业务代码分离
2. WHEN 构建静态资源时，THE BuildPipeline SHALL 为所有静态资源文件名添加内容哈希（content hash）以支持长期缓存
3. WHEN 构建完成时，THE BuildPipeline SHALL 生成 Brotli 压缩版本（`.br`）的 JS、CSS 和 HTML 文件
4. WHEN Vite 处理图片资源时，THE BuildPipeline SHALL 配置 `assetsInlineLimit` 将小于 4KB 的图片内联为 base64 以减少 HTTP 请求
5. WHEN 构建完成时，THE BuildPipeline SHALL 输出构建产物的大小报告，标记超过 100KB 的单个 chunk
6. IF 构建过程中出现错误，THEN THE BuildPipeline SHALL 输出明确的错误信息并以非零退出码终止，不生成不完整的构建产物

---

### 需求 8：缓存策略配置

**用户故事：** 作为网站访客，我希望重复访问时页面加载更快，以便减少不必要的网络请求。

#### 验收标准

1. WHEN 浏览器请求带有内容哈希的静态资源（JS、CSS、字体、图片）时，THE CacheStrategy SHALL 通过响应头设置 `Cache-Control: public, max-age=31536000, immutable`
2. WHEN 浏览器请求 HTML 页面时，THE CacheStrategy SHALL 通过响应头设置 `Cache-Control: public, max-age=0, must-revalidate` 确保内容始终最新
3. WHEN 浏览器请求音频文件时，THE CacheStrategy SHALL 通过响应头设置 `Cache-Control: public, max-age=86400` 缓存 1 天
4. WHERE 部署平台为 Vercel 时，THE CacheStrategy SHALL 通过 `vercel.json` 的 `headers` 字段配置上述缓存规则
5. IF 资源文件不包含内容哈希（如 `favicon.ico`、`robots.txt`），THEN THE CacheStrategy SHALL 设置较短的缓存时间（`max-age=3600`）

---

### 需求 9：性能监控与基准测试

**用户故事：** 作为开发者，我希望能量化优化效果，以便验证每项优化措施的实际收益。

#### 验收标准

1. THE Site SHALL 在构建脚本中集成 Lighthouse CI 或等效工具，在每次构建后自动生成性能报告
2. WHEN 运行性能测试时，THE Site SHALL 测量并记录 LCP、CLS、INP、FCP 和 TTFB 五项核心指标
3. WHEN 性能报告生成时，THE Site SHALL 将结果与基准值对比，标记出现回退（regression）的指标
4. THE Site SHALL 在 `docs/` 目录下维护一份性能基准记录文件，记录优化前后的各项指标数值
