# 音乐播放器卡片组件

一个功能完整的音乐播放器组件，可在 MDX 文件中使用。

## 功能特性

- ✅ 完整的音频播放控制（播放、暂停、进度跳转）
- ✅ 音量控制和静音功能
- ✅ 自定义 SVG 绘制的播放控制按钮
- ✅ 进度条显示和交互
- ✅ 音频文件下载功能
- ✅ 多播放器互斥（同时只有一个播放）
- ✅ 响应式设计（支持移动端和桌面端）
- ✅ 深色模式支持
- ✅ 自定义主题色
- ✅ 错误处理和加载状态显示

## 快速开始

### 1. 在 MDX 文件中导入组件

```mdx
import MusicPlayerCard from '../components/mdx/MusicPlayerCard.astro';
```

### 2. 使用组件

```mdx
<MusicPlayerCard
  src="/audio/song.mp3"
  title="歌曲名称"
  artist="艺术家名称"
  cover="/img/cover.jpg"
/>
```

## API 文档

### 必需属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `src` | `string` | 音频文件路径（相对于 public 目录） |
| `title` | `string` | 歌曲名称 |
| `artist` | `string` | 艺术家名称 |

### 可选属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cover` | `string` | - | 封面图片路径 |
| `defaultCover` | `string` | `'/img/tx.png'` | 默认封面图片路径 |
| `allowDownload` | `boolean` | `true` | 是否显示下载按钮 |
| `autoPlay` | `boolean` | `false` | 是否自动播放 |
| `loop` | `boolean` | `false` | 是否循环播放 |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | 预加载策略 |
| `accentColor` | `string` | - | 主题色（CSS 颜色值） |
| `className` | `string` | `''` | 额外的 CSS 类名 |

## 使用示例

### 基本用法

```mdx
<MusicPlayerCard
  src="/audio/song.mp3"
  title="Beautiful Song"
  artist="Amazing Artist"
/>
```

### 完整配置

```mdx
<MusicPlayerCard
  src="/audio/song.mp3"
  title="Beautiful Song"
  artist="Amazing Artist"
  cover="/img/album-cover.jpg"
  defaultCover="/img/default-music.png"
  allowDownload={true}
  autoPlay={false}
  loop={false}
  preload="metadata"
  accentColor="#3b82f6"
  className="my-custom-player"
/>
```

### 多个播放器

```mdx
<MusicPlayerCard
  src="/audio/song1.mp3"
  title="Song 1"
  artist="Artist A"
/>

<MusicPlayerCard
  src="/audio/song2.mp3"
  title="Song 2"
  artist="Artist B"
/>
```

当有多个播放器时，系统会自动确保同时只有一个播放器在播放。

## 文件结构

```
src/components/mdx/
├── MusicPlayerCard.astro          # 主组件
└── music-player/
    ├── AudioEngine.ts             # 音频引擎
    ├── PlayerManager.ts           # 播放器管理器
    ├── PlayPauseButton.astro      # 播放/暂停按钮
    ├── ProgressBar.astro          # 进度条
    ├── VolumeControl.astro        # 音量控制
    ├── DownloadButton.astro       # 下载按钮
    ├── types.ts                   # TypeScript 类型定义
    ├── utils.ts                   # 工具函数
    ├── AudioEngine.test.ts        # 测试文件
    ├── example.mdx                # 使用示例
    └── README.md                  # 本文档
```

## 技术实现

### 核心技术

- **Astro 5.x**: 组件框架
- **HTML5 Audio API**: 音频播放
- **SVG**: 自定义图标绘制
- **TypeScript**: 类型安全
- **Tailwind CSS + DaisyUI**: 样式系统

### 架构设计

1. **AudioEngine**: 封装 HTML5 Audio API，提供统一的音频控制接口
2. **PlayerManager**: 单例模式管理多个播放器，实现互斥播放
3. **组件化设计**: 每个 UI 元素都是独立的 Astro 组件
4. **事件驱动**: 使用事件监听器实现 UI 和音频状态同步

### 测试

组件包含完整的测试套件：

- **属性测试**: 使用 fast-check 进行基于属性的测试
- **单元测试**: 使用 Vitest 进行单元测试
- **测试覆盖**: AudioEngine 核心功能、事件系统、边界情况

运行测试：

```bash
pnpm vitest run src/components/mdx/music-player/
```

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- 移动浏览器: ✅ 完全支持

## 注意事项

1. **音频文件位置**: 音频文件必须放在 `public` 目录下
2. **自动播放限制**: 大多数浏览器限制自动播放，建议设置 `autoPlay={false}`
3. **文件格式**: 推荐使用 MP3 格式以获得最佳兼容性
4. **性能**: 避免在单个页面放置过多播放器（建议不超过 10 个）

## 故障排除

### 音频无法播放

1. 检查音频文件路径是否正确
2. 确认音频文件存在于 `public` 目录
3. 检查浏览器控制台是否有错误信息
4. 确认音频文件格式被浏览器支持

### 封面图片不显示

1. 检查图片路径是否正确
2. 确认图片文件存在
3. 组件会自动使用默认封面作为后备

### 样式问题

1. 确认 Tailwind CSS 已正确配置
2. 检查是否有 CSS 冲突
3. 使用 `className` 属性添加自定义样式

## 许可证

本组件遵循项目的整体许可证。

## 贡献

欢迎提交 Issue 和 Pull Request！
