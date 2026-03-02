/**
 * PlayerManager - 全局播放器管理器
 * 实现单例模式，确保同时只有一个播放器在播放
 */

import type { AudioEngine } from './AudioEngine';

class PlayerManager {
  private static instance: PlayerManager;
  private players: Map<string, AudioEngine> = new Map();
  private currentPlayingId: string | null = null;

  private constructor() {}

  /**
   * 获取 PlayerManager 单例实例
   */
  static getInstance(): PlayerManager {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager();
    }
    return PlayerManager.instance;
  }

  /**
   * 注册播放器
   * @param id - 播放器唯一标识
   * @param player - AudioEngine 实例
   */
  register(id: string, player: AudioEngine): void {
    this.players.set(id, player);
  }

  /**
   * 注销播放器
   * @param id - 播放器唯一标识
   */
  unregister(id: string): void {
    this.players.delete(id);
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
    }
  }

  /**
   * 通知播放器开始播放
   * 会自动暂停其他正在播放的播放器
   * @param id - 播放器唯一标识
   */
  notifyPlay(id: string): void {
    // 如果有其他播放器正在播放，暂停它
    if (this.currentPlayingId && this.currentPlayingId !== id) {
      const currentPlayer = this.players.get(this.currentPlayingId);
      if (currentPlayer && currentPlayer.isPlaying()) {
        currentPlayer.pause();
      }
    }
    
    // 更新当前播放的播放器
    this.currentPlayingId = id;
  }

  /**
   * 通知播放器暂停
   * @param id - 播放器唯一标识
   */
  notifyPause(id: string): void {
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
    }
  }

  /**
   * 获取当前正在播放的播放器 ID
   */
  getCurrentPlayingId(): string | null {
    return this.currentPlayingId;
  }

  /**
   * 暂停所有播放器
   */
  pauseAll(): void {
    this.players.forEach((player) => {
      if (player.isPlaying()) {
        player.pause();
      }
    });
    this.currentPlayingId = null;
  }
}

export default PlayerManager;
