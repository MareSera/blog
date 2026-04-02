# 设计文档：站点性能优化

## 概述

本设计文档描述对 Frosti Astro 博客网站进行全面性能优化的技术方案。优化策略分为**构建时优化**（Build-time）和**运行时优化**（Runtime）两大类，在不改变任何现有功能和视觉效果的前提下，通过多个维度的改进提升 Core Web Vitals 指标。

当前已有的优化基础：
- `@playform/compress` 集成（CSS/HTML/JS/SVG/Image 压缩）
- `@rollup/plugin-terser` JS 压缩
- Astro `prefetch` 配置（`prefetchAll: true`, `defaultStrategy: "viewport"`）
- Sharp 图片服务
- `font-display: swap` 已在 global.scss 中配置
- `will-change: transform` 已在 MagneticCursor 中配置

本次优化在此基础上进行增量改进，重点解决以下已识别问题：
1. 字体文件仍为 TTF 格式（未转换为 WOFF2）
2. 预加载链接指向 TTF 而非 WOFF2
3. MagneticCursor RAF 循环无条件持续运行
4. 音频文件无懒加载机制
5. KaTeX CSS 同步阻塞渲染
6. 缺少 Brotli 压缩
7. 缺少 Vite `manualChunks` 配置
8. 缓存头配置不完整

---

## 架构

```mermaid
graph TB
    subgraph BuildTime["构建时优化 (Build-time)"]
        A[astro.config.mjs] --> B[Vite 配置优化]
        A --> C[字体转换脚本]
        A --> D[@playform/compress 增强]
        B --> E[manualChunks 代码分割]
        B --> F[assetsInlineLimit 内联小图]
        B --> G[Brotli 压缩输出]
    end

    subgraph RuntimeOpt["运行时优化 (Runtime)"]
        H[BaseLayout.astro] --> I[关键 CSS 内联]
        H --> J[字体预加载 WOFF2]
        H --> K[资源预连接]
        L[MagneticCursor.astro] --> M[RAF 空闲暂停]
        L --> N[prefers-reduced-motion]
        O[AudioPlayer] --> P[懒加载音频]
        Q[Header.astro] --> R[KaTeX 异步加载]
    end

    subgraph CacheLayer["缓存层"]
        S[vercel.json] --> T[静态资源长期缓存]
        S --> U[HTML 无缓存]
        S --> V[音频短期缓存]
    end

    BuildTime --> W[dist/ 构建产物]
    RuntimeOpt --> W
    CacheLayer --> X[Vercel CDN]
    W --> X
```

---

## 组件与接口

### 2.1 字体优化模块

**文件：** `scripts/convert-fonts.ts`

负责将 `public/fonts/` 目录下的 TTF 字体文件转换为 WOFF2 格式。

```typescript
interface FontConversionResult {
  input: string;   // 原始 TTF 文件路径
  output: string;  // 输出 WOFF2 文件路径
  originalSize: number;  // 原始文件大小（字节）
  compressedSize: number; // 压缩后大小（字节）
  compressionRatio: number; // 压缩比
}

// 转换单个字体文件
async function convertFont(ttfPath: string): Promise<FontConversionResult>

// 批量转换目录下所有 TTF 文件
async function convertAllFonts(fontsDir: string): Promise<FontConversionResult[]>
```

**集成点：** 在 `package.json` 的 `build` 脚本中，在 `astro build` 之前执行字体转换。

### 2.2 MagneticCursor 优化

**文件：** `src/components/MagneticCursor.astro`（修改现有文件）

优化 RAF 循环，实现空闲暂停和 `prefers-reduced-motion` 支持。

```typescript
interface CursorState {
  mouseX: number;
  mouseY: number;
  curX: number;
  curY: number;
  curW: number;
  curH: number;
  targetW: number;
  targetH: number;
  rafId: number | null;
  visible: boolean;
  lastMoveTime: number;  // 新增：最后一次鼠标移动时间戳
  isIdle: boolean;       // 新增：是否处于空闲状态
}
```

**优化逻辑：**
- 在 `onMouseMove` 中记录 `lastMoveTime = Date.now()`
- 在 `tick()` 中检查 `Date.now() - lastMoveTime > 2000`，若超时则设置 `isIdle = true` 并停止 RAF
- 在 `onMouseMove` 中若 `isIdle === true`，则重新启动 RAF 循环
- 在初始化时检查 `window.matchMedia('(prefers-reduced-motion: reduce)').matches`，若为 true 则跳过初始化

### 2.3 音频懒加载模块

**文件：** 涉及音频播放器相关组件（具体路径待确认，基于 AudioEngine.ts / PlayerManager.ts）

```typescript
interface AudioLoadState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  src: string;
  error?: Error;
}

// 懒加载音频
async function loadAudioOnDemand(src: string): Promise<HTMLAudioElement>
```

**关键变更：**
- 所有 `<audio>` 元素初始设置 `preload="none"`
- 播放按钮点击时触发 `loadAudioOnDemand()`
- 加载期间显示 loading spinner

### 2.4 构建配置优化

**文件：** `astro.config.mjs`（修改现有文件）

```javascript
// Vite 配置新增项
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-swup': ['@swup/astro'],
          'vendor-pagefind': ['@pagefind/default-ui'],
          'vendor-katex': ['katex'],
          'vendor-medium-zoom': ['medium-zoom'],
        }
      }
    },
    assetsInlineLimit: 4096,  // 4KB 以下内联
    chunkSizeWarningLimit: 100, // 100KB 警告
  },
  plugins: [
    // Brotli 压缩插件
  ]
}
```

### 2.5 缓存策略配置

**文件：** `vercel.json`（修改现有文件）

```json
{
  "headers": [
    {
      "source": "/_astro/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/audio/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/(favicon.ico|robots.txt|sitemap.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    }
  ]
}
```

### 2.6 KaTeX 异步加载

**文件：** `src/components/Header.astro`（修改现有文件）

将 KaTeX CSS 从同步 `import` 改为异步加载：

```html
<!-- 替换原有的同步 import -->
<link
  rel="stylesheet"
  href="/node_modules/katex/dist/katex.min.css"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link rel="stylesheet" href="/node_modules/katex/dist/katex.min.css" />
</noscript>
```

---

## 数据模型

### 3.1 性能基准记录

**文件：** `docs/performance-baseline.md`

```markdown
| 指标 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| LCP  | -      | -      | -    |
| CLS  | -      | -      | -    |
| INP  | -      | -      | -    |
| FCP  | -      | -      | -    |
| TTFB | -      | -      | -    |
| JS Bundle Size | - | - | - |
| CSS Bundle Size | - | - | - |
| Font Size (TTF) | - | - | - |
| Font Size (WOFF2) | - | - | - |
```

### 3.2 字体转换结果模型

```typescript
interface FontConversionReport {
  timestamp: string;
  fonts: FontConversionResult[];
  totalOriginalSize: number;
  totalCompressedSize: number;
  overallCompressionRatio: number;
}
```

### 3.3 构建产物大小报告

由 Vite `chunkSizeWarningLimit` 和自定义插件生成，格式：

```typescript
interface BuildSizeReport {
  chunks: Array<{
    name: string;
    size: number;       // 原始大小（字节）
    gzipSize: number;   // Gzip 压缩后大小
    brotliSize: number; // Brotli 压缩后大小
    isOverLimit: boolean; // 是否超过 100KB
  }>;
}
```

---

## 正确性属性

*属性（Property）是在系统所有有效执行中都应成立的特征或行为——本质上是对系统应做什么的形式化陈述。属性作为人类可读规范与机器可验证正确性保证之间的桥梁。*


### 属性 1：图片构建产物格式正确性
*对于任意* 在 `src/` 或 `public/` 中被引用的图片文件，构建产物中应存在对应的 WebP 或 AVIF 格式版本，且原始格式（PNG/JPG）不应作为主要输出格式出现在 `dist/_astro/` 目录中。
**验证：需求 1.1、1.5**

### 属性 2：图片尺寸属性完整性
*对于任意* 通过 Astro `<Image>` 组件渲染的图片，生成的 HTML 中该 `<img>` 标签必须同时包含 `width` 和 `height` 属性，且两者均为正整数。
**验证：需求 1.4**

### 属性 3：字体格式转换正确性
*对于任意* `public/fonts/` 目录下的 TTF 字体文件，执行转换脚本后，应在同目录生成对应的 WOFF2 文件，且 WOFF2 文件大小应小于原始 TTF 文件大小。
**验证：需求 2.1**

### 属性 4：字体预加载链接格式一致性
*对于任意* 页面 HTML 中通过 `<link rel="preload" as="font">` 预加载的字体，其 `href` 属性必须指向 `.woff2` 格式文件，不得指向 `.ttf` 文件。
**验证：需求 2.5**

### 属性 5：font-display 策略全覆盖
*对于任意* 在 CSS 中声明的 `@font-face` 规则，必须包含 `font-display: swap` 描述符。
**验证：需求 2.2**

### 属性 6：MagneticCursor RAF 空闲暂停
*对于任意* 初始化后的 MagneticCursor 实例，当模拟鼠标停止移动超过 2000ms 后，RAF 循环应停止（`rafId` 应为 `null`）；当再次触发 `mousemove` 事件后，RAF 循环应重新启动。
**验证：需求 3.3、3.4**

### 属性 7：View Transitions 事件监听器无泄漏
*对于任意* 次数的 `astro:page-load` 事件触发（模拟页面切换），`mousemove` 事件监听器的数量不应随切换次数增加，应保持为 1。
**验证：需求 3.6**

### 属性 8：音频元素懒加载属性
*对于任意* 页面初始渲染时，所有 `<audio>` 元素的 `preload` 属性值必须为 `"none"`，不得为 `"auto"` 或 `"metadata"`。
**验证：需求 6.1、6.6**

### 属性 9：构建产物包含内容哈希
*对于任意* 构建产物中 `dist/_astro/` 目录下的 JS 和 CSS 文件，其文件名必须包含内容哈希（匹配正则 `/\.[a-f0-9]{8,}\.(js|css)$/`）。
**验证：需求 7.2**

### 属性 10：Brotli 压缩产物存在性
*对于任意* `dist/` 目录下大于 1KB 的 JS 和 CSS 文件，应存在对应的 `.br` 压缩版本文件。
**验证：需求 7.3**

### 属性 11：缓存规则覆盖完整性
*对于任意* `vercel.json` 中定义的 `headers` 规则，静态资源路径（`/_astro/*`、`/fonts/*`）必须配置 `max-age=31536000, immutable`；HTML 路径必须配置 `max-age=0, must-revalidate`；音频路径必须配置 `max-age=86400`。
**验证：需求 8.1、8.2、8.3**

### 属性 12：CSS 压缩后无多余空白
*对于任意* 构建产物中的 CSS 文件，文件内容不应包含连续的多个空格或换行符（即已被压缩），文件大小应小于对应源文件大小。
**验证：需求 4.2**

---

## 错误处理

### 字体转换失败
- 若 TTF 文件损坏或不可读，转换脚本应记录错误并跳过该文件，不中断整体构建
- 若 WOFF2 转换工具不可用，构建应继续使用原始 TTF 文件，并输出警告

### 图片优化失败
- 若 Sharp 无法处理特定图片格式，保留原始图片并记录警告
- 若图片路径不存在，Astro 构建时会报错，这是预期行为

### 音频加载失败
- 网络错误：显示重试按钮，错误信息本地化
- 格式不支持：显示"当前浏览器不支持此音频格式"提示
- 超时（>10s）：自动触发重试一次，仍失败则显示错误

### MagneticCursor 降级
- 不支持 RAF：隐藏 `.mag-pointer` 元素，恢复 `cursor: auto`
- `prefers-reduced-motion: reduce`：隐藏 `.mag-pointer` 元素，恢复默认光标
- 触摸设备（`ontouchstart` 存在）：不初始化光标，避免在移动端显示无用元素

---

## 测试策略

### 双轨测试方法

本优化方案采用**单元测试**和**属性测试**相结合的方式：

- **单元测试**：验证具体示例、边界情况和错误条件
- **属性测试**：验证跨所有输入的通用属性（使用 `fast-check` 库，项目已安装）

### 属性测试配置

使用项目已有的 `fast-check` 库（`node_modules/fast-check`）和 `vitest` 测试框架。

每个属性测试最少运行 **100 次迭代**。

标签格式：`Feature: site-performance-optimization, Property {N}: {属性描述}`

### 单元测试覆盖

- 字体转换脚本：测试 TTF→WOFF2 转换的正确性
- MagneticCursor：测试空闲检测逻辑、事件监听器清理
- 音频懒加载：测试加载状态机转换
- 构建配置：测试 vercel.json 缓存规则格式

### 属性测试覆盖

每个正确性属性（属性 1-12）对应一个属性测试，使用 `fast-check` 生成随机输入：

- 属性 1-2：生成随机图片路径，验证构建产物格式
- 属性 3：生成随机字体文件，验证转换结果
- 属性 4-5：生成随机 HTML/CSS 内容，验证字体引用格式
- 属性 6-7：模拟随机鼠标事件序列，验证 RAF 状态
- 属性 8：解析生成的 HTML，验证 audio 元素属性
- 属性 9-10：扫描构建产物目录，验证文件命名和压缩
- 属性 11：解析 vercel.json，验证缓存规则
- 属性 12：读取构建产物 CSS，验证压缩状态

### 性能回归测试

在 `scripts/` 目录新增 `check-performance.ts`，集成 Lighthouse Node.js API，在本地构建后自动运行并与基准值对比。
