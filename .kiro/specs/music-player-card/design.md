# Design Document: Music Player Card

## Overview

音乐播放器卡片组件是一个基于 Astro 框架的 MDX 组件，提供完整的音频播放功能。该组件采用客户端渲染策略，使用 HTML5 Audio API 实现音频播放，并通过 SVG 绘制自定义播放控制按钮。组件设计为自包含、可复用，能够无缝集成到博客文章和随笔页面中。

## Architecture

### 组件架构

```
MusicPlayerCard (Astro Component)
├── Props Interface (TypeScript)
├── Audio Engine (Client-side Script)
│   ├── HTML5 Audio API
│   ├── Playback Control
│   ├── Progress Management
│   └── Volume Control
├── UI Layer
│   ├── Album Cover Display
│   ├── Music Info Display
│   ├── Custom SVG Controls
│   │   ├── Play/Pause Button
│   │   ├── Progress Bar
│   │   └── Volume Slider
│   └── Download Button
└── Error Handling Layer
```

### 技术栈选择

- **框架**: Astro 5.x with MDX support
- **样式**: Tailwind CSS + DaisyUI (项目现有)
- **图形**: SVG (用于播放控制按钮)
- **音频**: HTML5 Audio API
- **类型**: TypeScript
- **客户端交互**: Astro client directives (`client:load` 或 `client:visible`)

### 渲染策略

组件将使用 Astro 的客户端指令进行部分水合（partial hydration）：
- 静态内容（封面、标题、艺术家）在服务端渲染
- 交互式控件（播放器、进度条、音量控制）在客户端水合
- 使用 `client:visible` 延迟加载，优化性能

## Components and Interfaces

### 1. MusicPlayerCard 组件接口

```typescript
export interface MusicPlayerCardProps {
  // 必需属性
  src: string;              // 音频文件路径（相对于 public 目录）
  title: string;            // 歌曲名称
  artist: string;           // 艺术家名称
  
  // 可选属性
  cover?: string;           // 封面图片路径（相对于 public 目录）
  defaultCover?: string;    // 默认封面图片路径
  allowDownload?: boolean;  // 是否显示下载按钮（默认 true）
  autoPlay?: boolean;       // 是否自动播放（默认 false）
  loop?: boolean;           // 是否循环播放（默认 false）
  preload?: 'none' | 'metadata' | 'auto'; // 预加载策略（默认 'metadata'）
  
  // 样式定制
  accentColor?: string;     // 主题色（默认使用 DaisyUI primary）
  className?: string;       // 额外的 CSS 类名
}
```

### 2. AudioEngine 类

```typescript
class AudioEngine {
  private audio: HTMLAudioElement;
  private isPlaying: boolean;
  private currentTime: number;
  private duration: number;
  private volume: number;
  
  constructor(src: string, options: AudioOptions);
  
  // 播放控制
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  
  // 音量控制
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unmute(): void;
  
  // 状态查询
  isPlaying(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getProgress(): number; // 返回 0-100 的百分比
  
  // 事件监听
  onTimeUpdate(callback: (time: number) => void): void;
  onEnded(callback: () => void): void;
  onError(callback: (error: Error) => void): void;
  onLoadedMetadata(callback: () => void): void;
  
  // 资源管理
  destroy(): void;
}
```

### 3. SVG 控制按钮组件

#### PlayPauseButton

```typescript
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: number;        // 默认 48
  color?: string;       // 默认 'currentColor'
  className?: string;
}
```

SVG 结构：
- Play 图标：右指三角形 (▶)
- Pause 图标：两个竖条 (⏸)
- 使用 CSS transition 实现平滑切换动画

#### ProgressBar

```typescript
interface ProgressBarProps {
  progress: number;     // 0-100
  currentTime: number;  // 秒
  duration: number;     // 秒
  onSeek: (time: number) => void;
  className?: string;
}
```

#### VolumeControl

```typescript
interface VolumeControlProps {
  volume: number;       // 0-1
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}
```

### 4. 文件结构

```
src/components/mdx/
├── MusicPlayerCard.astro          # 主组件
├── music-player/
│   ├── AudioEngine.ts             # 音频引擎类
│   ├── PlayPauseButton.astro      # 播放/暂停按钮
│   ├── ProgressBar.astro          # 进度条组件
│   ├── VolumeControl.astro        # 音量控制组件
│   ├── DownloadButton.astro       # 下载按钮组件
│   ├── types.ts                   # TypeScript 类型定义
│   └── utils.ts                   # 工具函数（时间格式化等）
```

## Data Models

### AudioState

```typescript
interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;      // 0-100
  volume: number;        // 0-1
  isMuted: boolean;
  isLoading: boolean;
  error: AudioError | null;
}
```

### AudioError

```typescript
interface AudioError {
  type: 'LOAD_FAILED' | 'FORMAT_UNSUPPORTED' | 'NETWORK_ERROR' | 'DECODE_ERROR';
  message: string;
  originalError?: Error;
}
```

### AudioOptions

```typescript
interface AudioOptions {
  autoPlay?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  volume?: number;      // 0-1, 默认 0.8
}
```

## Correctness Properties

*属性（Property）是系统在所有有效执行中应该保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

