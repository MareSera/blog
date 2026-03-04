/**
 * Contrast Ratio Checker
 * Implements WCAG contrast ratio calculation
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  if (hex.length !== 6) {
    return null;
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Calculate relative luminance according to WCAG
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  // Convert to 0-1 range
  const [rs, gs, bs] = [r, g, b].map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 */
export function meetsWCAGAA(
  textColor: string,
  bgColor: string,
  fontSize: number = 16
): { passes: boolean; ratio: number; required: number } {
  const ratio = calculateContrastRatio(textColor, bgColor);
  const required = fontSize >= 18 ? 3.0 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio,
    required
  };
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 */
export function meetsWCAGAAA(
  textColor: string,
  bgColor: string,
  fontSize: number = 16
): { passes: boolean; ratio: number; required: number } {
  const ratio = calculateContrastRatio(textColor, bgColor);
  const required = fontSize >= 18 ? 4.5 : 7.0;
  
  return {
    passes: ratio >= required,
    ratio,
    required
  };
}
