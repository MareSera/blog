/**
 * 音乐播放器组件的工具函数
 */

/**
 * 将秒数格式化为 "mm:ss" 格式
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串（例如："03:45"）
 * 
 * @example
 * formatTime(0)    // "00:00"
 * formatTime(65)   // "01:05"
 * formatTime(3661) // "61:01"
 */
export function formatTime(seconds: number): string {
  // 处理无效输入
  if (!isFinite(seconds) || seconds < 0) {
    return "00:00";
  }
  
  // 向下取整以避免小数
  const totalSeconds = Math.floor(seconds);
  
  // 计算分钟和秒
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  
  // 格式化为两位数
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}
