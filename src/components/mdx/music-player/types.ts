/**
 * 音乐播放器卡片组件的 TypeScript 类型定义
 */

/**
 * 音乐播放器卡片组件的属性接口
 */
export interface MusicPlayerCardProps {
  // 必需属性
  /** 音频文件路径（相对于 public 目录） */
  src: string;
  /** 歌曲名称 */
  title: string;
  /** 艺术家名称 */
  artist: string;
  
  // 可选属性
  /** 封面图片路径（相对于 public 目录） */
  cover?: string;
  /** 默认封面图片路径 */
  defaultCover?: string;
  /** 是否显示下载按钮（默认 true） */
  allowDownload?: boolean;
  /** 是否自动播放（默认 false） */
  autoPlay?: boolean;
  /** 是否循环播放（默认 false） */
  loop?: boolean;
  /** 预加载策略（默认 'metadata'） */
  preload?: 'none' | 'metadata' | 'auto';
  
  // 样式定制
  /** 主题色（默认使用 DaisyUI primary） */
  accentColor?: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 音频状态接口
 */
export interface AudioState {
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 音频总时长（秒） */
  duration: number;
  /** 播放进度（0-100） */
  progress: number;
  /** 音量（0-1） */
  volume: number;
  /** 是否静音 */
  isMuted: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: AudioError | null;
}

/**
 * 音频错误类型
 */
export type AudioErrorType = 
  | 'LOAD_FAILED' 
  | 'FORMAT_UNSUPPORTED' 
  | 'NETWORK_ERROR' 
  | 'DECODE_ERROR';

/**
 * 音频错误接口
 */
export interface AudioError {
  /** 错误类型 */
  type: AudioErrorType;
  /** 错误消息 */
  message: string;
  /** 原始错误对象 */
  originalError?: Error;
}

/**
 * 音频选项接口
 */
export interface AudioOptions {
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 预加载策略 */
  preload?: 'none' | 'metadata' | 'auto';
  /** 音量（0-1，默认 0.8） */
  volume?: number;
}
