/**
 * AudioEngine - 音频播放引擎
 * 基于 HTML5 Audio API 的音频播放控制模块
 */

import type { AudioOptions } from './types';
import PlayerManager from './PlayerManager';

/**
 * 音频引擎类
 * 提供完整的音频播放控制功能
 */
export class AudioEngine {
  private audio: HTMLAudioElement;
  private _isPlaying: boolean = false;
  private _volume: number;
  private _isMuted: boolean = false;
  private previousVolume: number = 0.8;
  private playerId: string;
  private playerManager: PlayerManager;

  /**
   * 创建音频引擎实例
   * @param src - 音频文件路径
   * @param options - 音频选项
   * @param playerId - 播放器唯一标识（可选）
   */
  constructor(src: string, options: AudioOptions = {}, playerId?: string) {
    this.audio = new Audio(src);
    this.playerId = playerId || `player-${Math.random().toString(36).substring(2, 11)}`;
    this.playerManager = PlayerManager.getInstance();
    
    // 注册到播放器管理器
    this.playerManager.register(this.playerId, this);
    
    // 应用选项
    this.audio.autoplay = options.autoPlay ?? false;
    this.audio.loop = options.loop ?? false;
    this.audio.preload = options.preload ?? 'auto'; // 默认改为 auto 以加快加载
    
    // 设置初始音量
    this._volume = options.volume ?? 0.8;
    this.audio.volume = this._volume;
    
    // 开始预加载
    if (this.audio.preload === 'auto') {
      this.audio.load();
    }
    
    // 监听播放状态变化
    this.audio.addEventListener('play', () => {
      this._isPlaying = true;
    });
    
    this.audio.addEventListener('pause', () => {
      this._isPlaying = false;
    });
    
    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
    });
  }

  /**
   * 播放音频
   * @returns Promise，在播放开始时 resolve
   */
  async play(): Promise<void> {
    try {
      console.log('AudioEngine.play() 被调用, src:', this.audio.src);
      
      // 通知播放器管理器
      this.playerManager.notifyPlay(this.playerId);
      
      await this.audio.play();
      this._isPlaying = true;
      console.log('音频播放成功');
    } catch (error) {
      console.error('音频播放失败:', error);
      this._isPlaying = false;
      throw error;
    }
  }

  /**
   * 暂停音频
   */
  pause(): void {
    this.audio.pause();
    this._isPlaying = false;
    
    // 通知播放器管理器
    this.playerManager.notifyPause(this.playerId);
  }

  /**
   * 停止音频（暂停并重置到开始位置）
   */
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this._isPlaying = false;
    
    // 通知播放器管理器
    this.playerManager.notifyPause(this.playerId);
  }

  /**
   * 跳转到指定时间
   * @param time - 目标时间（秒）
   */
  seek(time: number): void {
    if (time < 0) {
      this.audio.currentTime = 0;
    } else if (time > this.audio.duration) {
      this.audio.currentTime = this.audio.duration;
    } else {
      this.audio.currentTime = time;
    }
  }

  /**
   * 设置音量
   * @param volume - 音量值（0-1）
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this._volume = clampedVolume;
    this.audio.volume = clampedVolume;
    
    // 如果设置了非零音量，自动取消静音
    if (clampedVolume > 0 && this._isMuted) {
      this._isMuted = false;
    }
  }

  /**
   * 获取当前音量
   * @returns 音量值（0-1）
   */
  getVolume(): number {
    return this._volume;
  }

  /**
   * 静音
   */
  mute(): void {
    if (!this._isMuted) {
      this.previousVolume = this._volume;
      this._volume = 0;
      this.audio.volume = 0;
      this._isMuted = true;
    }
  }

  /**
   * 取消静音
   */
  unmute(): void {
    if (this._isMuted) {
      this.audio.volume = this.previousVolume;
      this._volume = this.previousVolume;
      this._isMuted = false;
    }
  }

  /**
   * 检查是否正在播放
   * @returns 是否正在播放
   */
  isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * 获取当前播放时间
   * @returns 当前时间（秒）
   */
  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  /**
   * 获取音频总时长
   * @returns 总时长（秒）
   */
  getDuration(): number {
    return this.audio.duration || 0;
  }

  /**
   * 获取播放进度百分比
   * @returns 进度百分比（0-100）
   */
  getProgress(): number {
    const duration = this.getDuration();
    if (duration === 0) {
      return 0;
    }
    return (this.getCurrentTime() / duration) * 100;
  }

  /**
   * 监听时间更新事件
   * @param callback - 回调函数，接收当前时间作为参数
   */
  onTimeUpdate(callback: (time: number) => void): void {
    this.audio.addEventListener('timeupdate', () => {
      callback(this.getCurrentTime());
    });
  }

  /**
   * 监听播放结束事件
   * @param callback - 回调函数
   */
  onEnded(callback: () => void): void {
    this.audio.addEventListener('ended', callback);
  }

  /**
   * 监听错误事件
   * @param callback - 回调函数，接收错误对象作为参数
   */
  onError(callback: (error: Error) => void): void {
    this.audio.addEventListener('error', () => {
      const error = new Error(
        this.audio.error?.message || 'Unknown audio error'
      );
      callback(error);
    });
  }

  /**
   * 监听元数据加载完成事件
   * @param callback - 回调函数
   */
  onLoadedMetadata(callback: () => void): void {
    this.audio.addEventListener('loadedmetadata', callback);
  }

  /**
   * 销毁音频引擎，释放资源
   */
  destroy(): void {
    this.pause();
    this.audio.src = '';
    this.audio.load();
    
    // 从播放器管理器注销
    this.playerManager.unregister(this.playerId);
  }
}
