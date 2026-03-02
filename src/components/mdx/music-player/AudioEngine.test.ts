/**
 * AudioEngine 属性测试
 * 使用 fast-check 进行基于属性的测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { AudioEngine } from './AudioEngine';

/**
 * 创建模拟的音频元素用于测试
 */
function createMockAudio() {
  const listeners: Record<string, Function[]> = {};
  
  const mockAudio = {
    src: '',
    currentTime: 0,
    duration: 100,
    volume: 0.8,
    paused: true,
    autoplay: false,
    loop: false,
    preload: 'metadata',
    error: null,
    
    play: vi.fn().mockImplementation(async function(this: any) {
      this.paused = false;
      this.trigger('play');
      return Promise.resolve();
    }),
    
    pause: vi.fn().mockImplementation(function(this: any) {
      this.paused = true;
      this.trigger('pause');
    }),
    
    load: vi.fn(),
    
    addEventListener: vi.fn().mockImplementation(function(this: any, event: string, callback: Function) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    }),
    
    removeEventListener: vi.fn(),
    
    trigger: function(event: string, data?: any) {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(data));
      }
    }
  };
  
  return mockAudio;
}

describe('AudioEngine 属性测试', () => {
  let originalAudio: typeof Audio;
  
  beforeEach(() => {
    // 保存原始的 Audio 构造函数
    originalAudio = global.Audio;
    
    // 模拟 Audio 构造函数
    global.Audio = function() {
      return createMockAudio();
    } as any;
  });
  
  afterEach(() => {
    // 恢复原始的 Audio 构造函数
    global.Audio = originalAudio;
    vi.clearAllMocks();
  });
  
  /**
   * 属性 1：播放后暂停恢复状态
   * **验证：需求 2.1, 2.2**
   * 
   * 属性描述：
   * 对于任何有效的音频引擎实例，执行以下操作序列后：
   * 1. 播放音频
   * 2. 暂停音频
   * 音频引擎的状态应该正确反映为"未播放"状态
   */
  it('属性 1：播放后暂停应恢复到未播放状态', async () => {
    await fc.assert(
      fc.asyncProperty(
        // 生成随机的音频文件路径
        fc.webUrl(),
        // 生成随机的音频选项
        fc.record({
          autoPlay: fc.boolean(),
          loop: fc.boolean(),
          preload: fc.constantFrom('none', 'metadata', 'auto'),
          volume: fc.double({ min: 0, max: 1 })
        }),
        async (audioSrc, options) => {
          // 创建音频引擎实例
          const engine = new AudioEngine(audioSrc, options);
          
          // 播放音频
          await engine.play();
          
          // 验证播放状态
          expect(engine.isPlaying()).toBe(true);
          
          // 暂停音频
          engine.pause();
          
          // 验证暂停后的状态
          expect(engine.isPlaying()).toBe(false);
          
          // 清理资源
          engine.destroy();
        }
      ),
      { numRuns: 100 } // 运行 100 次测试
    );
  });
  
  /**
   * 属性 2：音量设置的边界约束
   * **验证：需求 2.2**
   * 
   * 属性描述：
   * 对于任何音量值（包括超出范围的值），
   * setVolume 方法应该将音量限制在 [0, 1] 范围内
   */
  it('属性 2：音量值应始终在 0-1 范围内', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.double({ min: -100, max: 100, noNaN: true }), // 包括超出范围的值
        (audioSrc, volumeValue) => {
          const engine = new AudioEngine(audioSrc);
          
          // 设置音量
          engine.setVolume(volumeValue);
          
          // 获取实际音量
          const actualVolume = engine.getVolume();
          
          // 验证音量在有效范围内
          expect(actualVolume).toBeGreaterThanOrEqual(0);
          expect(actualVolume).toBeLessThanOrEqual(1);
          
          // 清理资源
          engine.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * 属性 3：进度跳转的边界约束
   * **验证：需求 2.3**
   * 
   * 属性描述：
   * 对于任何时间值（包括负数和超出时长的值），
   * seek 方法应该将播放位置限制在 [0, duration] 范围内
   */
  it('属性 3：进度跳转应限制在有效范围内', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.double({ min: -100, max: 200, noNaN: true }),
        (audioSrc, seekTime) => {
          const engine = new AudioEngine(audioSrc);
          
          // 跳转到指定时间
          engine.seek(seekTime);
          
          // 获取当前时间
          const currentTime = engine.getCurrentTime();
          const duration = engine.getDuration();
          
          // 验证时间在有效范围内
          expect(currentTime).toBeGreaterThanOrEqual(0);
          expect(currentTime).toBeLessThanOrEqual(duration);
          
          // 清理资源
          engine.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * 属性 4：静音和取消静音的幂等性
   * **验证：需求 2.2**
   * 
   * 属性描述：
   * 多次调用 mute() 或 unmute() 应该是幂等的，
   * 即多次调用的效果与调用一次相同
   */
  it('属性 4：静音操作应该是幂等的', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.integer({ min: 1, max: 10 }), // 重复次数
        (audioSrc, repeatCount) => {
          const engine = new AudioEngine(audioSrc);
          const initialVolume = engine.getVolume();
          
          // 多次静音
          for (let i = 0; i < repeatCount; i++) {
            engine.mute();
          }
          
          // 验证音量为 0
          expect(engine.getVolume()).toBe(0);
          
          // 多次取消静音
          for (let i = 0; i < repeatCount; i++) {
            engine.unmute();
          }
          
          // 验证音量恢复到初始值
          expect(engine.getVolume()).toBe(initialVolume);
          
          // 清理资源
          engine.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('AudioEngine 事件系统单元测试', () => {
  let originalAudio: typeof Audio;
  
  beforeEach(() => {
    originalAudio = global.Audio;
    global.Audio = function() {
      return createMockAudio();
    } as any;
  });
  
  afterEach(() => {
    global.Audio = originalAudio;
    vi.clearAllMocks();
  });
  
  it('应该正确触发 onTimeUpdate 事件', () => {
    const engine = new AudioEngine('test.mp3');
    const callback = vi.fn();
    
    engine.onTimeUpdate(callback);
    
    // 模拟时间更新
    const mockAudio = (engine as any).audio;
    mockAudio.currentTime = 10;
    mockAudio.trigger('timeupdate');
    
    expect(callback).toHaveBeenCalledWith(10);
    
    engine.destroy();
  });
  
  it('应该正确触发 onEnded 事件', () => {
    const engine = new AudioEngine('test.mp3');
    const callback = vi.fn();
    
    engine.onEnded(callback);
    
    // 模拟播放结束
    const mockAudio = (engine as any).audio;
    mockAudio.trigger('ended');
    
    expect(callback).toHaveBeenCalled();
    
    engine.destroy();
  });
  
  it('应该正确触发 onError 事件', () => {
    const engine = new AudioEngine('test.mp3');
    const callback = vi.fn();
    
    engine.onError(callback);
    
    // 模拟错误
    const mockAudio = (engine as any).audio;
    mockAudio.error = { message: 'Test error' };
    mockAudio.trigger('error');
    
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(callback.mock.calls[0][0].message).toBe('Test error');
    
    engine.destroy();
  });
  
  it('应该正确触发 onLoadedMetadata 事件', () => {
    const engine = new AudioEngine('test.mp3');
    const callback = vi.fn();
    
    engine.onLoadedMetadata(callback);
    
    // 模拟元数据加载完成
    const mockAudio = (engine as any).audio;
    mockAudio.trigger('loadedmetadata');
    
    expect(callback).toHaveBeenCalled();
    
    engine.destroy();
  });
  
  it('destroy 方法应该正确清理资源', () => {
    const engine = new AudioEngine('test.mp3');
    const mockAudio = (engine as any).audio;
    
    // 设置一些状态
    mockAudio.currentTime = 50;
    
    // 销毁引擎
    engine.destroy();
    
    // 验证资源被清理
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(mockAudio.src).toBe('');
    expect(mockAudio.load).toHaveBeenCalled();
  });
});
