/**
 * Configuration Validation Script
 * Validates frosti.config.yaml and tailwind.config.mjs
 */

import * as fs from 'fs';
import * as yaml from 'js-yaml';

/**
 * Validate frosti.config.yaml theme configuration
 */
export function validateFrostiConfig(configPath: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config?: any;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(configPath)) {
    errors.push(`Config file not found: ${configPath}`);
    return { valid: false, errors, warnings };
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const config = yaml.load(content) as any;

    // Check if site.theme exists
    if (!config.site || !config.site.theme) {
      errors.push('Missing site.theme configuration');
      return { valid: false, errors, warnings, config };
    }

    const theme = config.site.theme;

    // Check light theme
    if (!theme.light) {
      errors.push('Missing theme.light configuration');
    } else if (theme.light !== 'monochrome-light') {
      warnings.push(`theme.light is "${theme.light}", expected "monochrome-light"`);
    }

    // Check dark theme
    if (!theme.dark) {
      errors.push('Missing theme.dark configuration');
    } else if (theme.dark !== 'monochrome-dark') {
      warnings.push(`theme.dark is "${theme.dark}", expected "monochrome-dark"`);
    }

    // Check code theme (should remain unchanged)
    if (!theme.code) {
      warnings.push('Missing theme.code configuration');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      config
    };
  } catch (error) {
    errors.push(`Failed to parse YAML: ${error}`);
    return { valid: false, errors, warnings };
  }
}

/**
 * Validate tailwind.config.mjs theme definitions
 */
export function validateTailwindConfig(configPath: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(configPath)) {
    errors.push(`Config file not found: ${configPath}`);
    return { valid: false, errors, warnings };
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');

    // Check for monochrome-light theme definition
    if (!content.includes('"monochrome-light"')) {
      errors.push('Missing "monochrome-light" theme definition');
    }

    // Check for monochrome-dark theme definition
    if (!content.includes('"monochrome-dark"')) {
      errors.push('Missing "monochrome-dark" theme definition');
    }

    // Check for required color variables in light theme
    const requiredLightVars = [
      'base-100',
      'base-200',
      'base-300',
      'base-content',
      'primary',
      'secondary',
      'accent'
    ];

    // Extract monochrome-light theme block
    const lightThemeMatch = content.match(/"monochrome-light":\s*\{([^}]+)\}/s);
    if (lightThemeMatch) {
      const lightThemeBlock = lightThemeMatch[1];
      for (const varName of requiredLightVars) {
        if (!lightThemeBlock.includes(`"${varName}"`)) {
          warnings.push(`Missing "${varName}" in monochrome-light theme`);
        }
      }
    }

    // Extract monochrome-dark theme block
    const darkThemeMatch = content.match(/"monochrome-dark":\s*\{([^}]+)\}/s);
    if (darkThemeMatch) {
      const darkThemeBlock = darkThemeMatch[1];
      for (const varName of requiredLightVars) {
        if (!darkThemeBlock.includes(`"${varName}"`)) {
          warnings.push(`Missing "${varName}" in monochrome-dark theme`);
        }
      }
    }

    // Check for DaisyUI configuration
    if (!content.includes('daisyui')) {
      warnings.push('Missing daisyui configuration section');
    }

    // Check if themes are registered in daisyui.themes
    const daisyuiThemesMatch = content.match(/daisyui:\s*\{[^}]*themes:\s*\[([^\]]+)\]/s);
    if (daisyuiThemesMatch) {
      const themesArray = daisyuiThemesMatch[1];
      if (!themesArray.includes('monochrome-light') && !themesArray.includes('monochrome-dark')) {
        warnings.push('Custom themes may not be registered in daisyui.themes array');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    errors.push(`Failed to read config file: ${error}`);
    return { valid: false, errors, warnings };
  }
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color);
}

/**
 * Check if a hex color is grayscale (R=G=B)
 */
export function isGrayscaleHex(hex: string): boolean {
  const normalized = hex.replace('#', '');
  let r, g, b;

  if (normalized.length === 3) {
    r = normalized[0];
    g = normalized[1];
    b = normalized[2];
    return r === g && g === b;
  } else if (normalized.length === 6) {
    r = normalized.substring(0, 2);
    g = normalized.substring(2, 4);
    b = normalized.substring(4, 6);
    return r === g && g === b;
  }

  return false;
}

/**
 * Extract color values from theme definition
 */
export function extractThemeColors(themeBlock: string): Record<string, string> {
  const colors: Record<string, string> = {};
  const colorPattern = /"([^"]+)":\s*"(#[0-9a-fA-F]{3,6})"/g;
  let match;

  while ((match = colorPattern.exec(themeBlock)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
}

/**
 * Validate all theme colors are grayscale
 */
export function validateThemeColorsGrayscale(configPath: string): {
  valid: boolean;
  errors: string[];
  nonGrayscaleColors: Record<string, string>;
} {
  const errors: string[] = [];
  const nonGrayscaleColors: Record<string, string> = {};

  if (!fs.existsSync(configPath)) {
    errors.push(`Config file not found: ${configPath}`);
    return { valid: false, errors, nonGrayscaleColors };
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');

    // Check monochrome-light theme
    const lightThemeMatch = content.match(/"monochrome-light":\s*\{([^}]+)\}/s);
    if (lightThemeMatch) {
      const colors = extractThemeColors(lightThemeMatch[1]);
      for (const [key, value] of Object.entries(colors)) {
        if (!isGrayscaleHex(value)) {
          nonGrayscaleColors[`monochrome-light.${key}`] = value;
        }
      }
    }

    // Check monochrome-dark theme
    const darkThemeMatch = content.match(/"monochrome-dark":\s*\{([^}]+)\}/s);
    if (darkThemeMatch) {
      const colors = extractThemeColors(darkThemeMatch[1]);
      for (const [key, value] of Object.entries(colors)) {
        if (!isGrayscaleHex(value)) {
          nonGrayscaleColors[`monochrome-dark.${key}`] = value;
        }
      }
    }

    if (Object.keys(nonGrayscaleColors).length > 0) {
      errors.push('Found non-grayscale colors in theme definitions');
    }

    return {
      valid: errors.length === 0,
      errors,
      nonGrayscaleColors
    };
  } catch (error) {
    errors.push(`Failed to validate colors: ${error}`);
    return { valid: false, errors, nonGrayscaleColors };
  }
}
