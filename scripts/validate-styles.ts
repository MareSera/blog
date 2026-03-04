/**
 * Style Validation Script
 * Validates that CSS/SCSS files follow monochrome theme guidelines
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Check if a file contains color variable references
 */
export function hasColorVariables(content: string): {
  hasColors: boolean;
  matches: string[];
} {
  const colorPatterns = [
    /oklch\(var\(--p\)\)/g,
    /oklch\(var\(--s\)\)/g,
    /oklch\(var\(--a\)\)/g,
    /oklch\(var\(--in\)\)/g,
    /oklch\(var\(--su\)\)/g,
    /oklch\(var\(--wa\)\)/g,
    /oklch\(var\(--er\)\)/g
  ];

  const matches: string[] = [];
  
  for (const pattern of colorPatterns) {
    const found = content.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  return {
    hasColors: matches.length > 0,
    matches
  };
}

/**
 * Extract all gradients from CSS content
 */
export function extractGradients(content: string): string[] {
  const gradientPattern = /(linear-gradient|radial-gradient)\([^)]+\)/g;
  return content.match(gradientPattern) || [];
}

/**
 * Check if a gradient uses only grayscale colors
 */
export function isGrayscaleGradient(gradient: string): boolean {
  // Check if gradient uses oklch(var(--bc)) or oklch(var(--b1/2/3))
  // This includes cases with alpha channel like oklch(var(--bc) / 0.5)
  const grayscaleVars = /oklch\(\s*var\(\s*--(bc|b[123])\s*\)(?:\s*\/\s*[\d.]+)?\s*\)/;
  if (grayscaleVars.test(gradient)) {
    return true;
  }

  // Check if gradient uses transparent
  if (gradient.includes('transparent')) {
    // If it only has transparent and no other colors, it's OK
    const hasOtherColors = /#[0-9a-fA-F]{3,6}/.test(gradient) || 
                          /rgb\(/.test(gradient) || 
                          /hsl\(/.test(gradient);
    if (!hasOtherColors) {
      return true;
    }
    // If it has transparent and grayscale vars, it's OK
    if (grayscaleVars.test(gradient)) {
      return true;
    }
  }

  // Check for hex colors in gradient
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g;
  const hexColors = gradient.match(hexPattern);
  
  if (hexColors) {
    // Check if all hex colors are grayscale (R=G=B)
    for (const hex of hexColors) {
      const normalized = hex.replace('#', '');
      let r, g, b;
      
      if (normalized.length === 3) {
        // For 3-digit hex, each digit represents a channel
        r = normalized[0];
        g = normalized[1];
        b = normalized[2];
      } else {
        // For 6-digit hex, each pair represents a channel
        r = normalized.substring(0, 2);
        g = normalized.substring(2, 4);
        b = normalized.substring(4, 6);
      }
      
      if (r !== g || g !== b) {
        return false;
      }
    }
    return true;
  }

  // If no colors found, consider it valid (might be using CSS variables)
  return true;
}

/**
 * Extract all shadows from CSS content
 */
export function extractShadows(content: string): string[] {
  const shadowPattern = /(box-shadow|text-shadow):\s*([^;]+);/g;
  const shadows: string[] = [];
  let match;

  while ((match = shadowPattern.exec(content)) !== null) {
    shadows.push(match[2]);
  }

  return shadows;
}

/**
 * Check if a shadow uses only grayscale colors
 */
export function isGrayscaleShadow(shadow: string): boolean {
  // Check if shadow uses oklch(var(--bc)) or similar with alpha
  const grayscaleVars = /oklch\(\s*var\(\s*--(bc|b[123])\s*\)(?:\s*\/\s*[\d.]+)?\s*\)/;
  if (grayscaleVars.test(shadow)) {
    return true;
  }

  // Check for hex colors in shadow
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g;
  const hexColors = shadow.match(hexPattern);
  
  if (hexColors) {
    // Check if all hex colors are grayscale
    for (const hex of hexColors) {
      const normalized = hex.replace('#', '');
      let r, g, b;
      
      if (normalized.length === 3) {
        r = normalized[0];
        g = normalized[1];
        b = normalized[2];
      } else {
        r = normalized.substring(0, 2);
        g = normalized.substring(2, 4);
        b = normalized.substring(4, 6);
      }
      
      if (r !== g || g !== b) {
        return false;
      }
    }
    return true;
  }

  // Check for rgb/rgba colors
  const rgbPattern = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;
  let rgbMatch;
  while ((rgbMatch = rgbPattern.exec(shadow)) !== null) {
    const [, r, g, b] = rgbMatch;
    if (r !== g || g !== b) {
      return false;
    }
  }

  // If no colors found, consider it valid (might be using CSS variables or no color specified)
  return true;
}

/**
 * Check if responsive media queries are present
 */
export function hasResponsiveQueries(content: string): boolean {
  const mediaQueryPattern = /@media\s*\([^)]*\)/g;
  const matches = content.match(mediaQueryPattern);
  return matches !== null && matches.length > 0;
}

/**
 * Validate a CSS/SCSS file
 */
export function validateStyleFile(filePath: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(filePath)) {
    errors.push(`File not found: ${filePath}`);
    return { valid: false, errors, warnings };
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for color variables
  const colorCheck = hasColorVariables(content);
  if (colorCheck.hasColors) {
    errors.push(`Found color variables: ${colorCheck.matches.join(', ')}`);
  }

  // Check gradients
  const gradients = extractGradients(content);
  for (const gradient of gradients) {
    if (!isGrayscaleGradient(gradient)) {
      warnings.push(`Non-grayscale gradient found: ${gradient.substring(0, 100)}...`);
    }
  }

  // Check shadows
  const shadows = extractShadows(content);
  for (const shadow of shadows) {
    if (!isGrayscaleShadow(shadow)) {
      warnings.push(`Non-grayscale shadow found: ${shadow.substring(0, 100)}...`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate all style files in a directory
 */
export function validateStylesInDirectory(dirPath: string): {
  totalFiles: number;
  validFiles: number;
  results: Record<string, ReturnType<typeof validateStyleFile>>;
} {
  const results: Record<string, ReturnType<typeof validateStyleFile>> = {};
  let totalFiles = 0;
  let validFiles = 0;

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and dist
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Check CSS and SCSS files
        if (entry.name.endsWith('.css') || entry.name.endsWith('.scss')) {
          totalFiles++;
          const result = validateStyleFile(fullPath);
          results[fullPath] = result;
          if (result.valid) {
            validFiles++;
          }
        }
      }
    }
  }

  scanDirectory(dirPath);

  return {
    totalFiles,
    validFiles,
    results
  };
}
