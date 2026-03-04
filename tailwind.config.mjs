/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from "@iconify/tailwind";
import typography from "@tailwindcss/typography";
import daisyUI from "daisyui";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['KeinannMaruPOP-CN', 'KeinannMaruPOP-JP', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
    },
  },
  safelist: [
    "alert",
    "alert-info",
    "alert-success",
    "alert-warning",
    "alert-error",
  ],
  plugins: [daisyUI, typography, addDynamicIconSelectors()],
  daisyui: {
    themes: [
      {
        "monochrome-light": {
          // Base colors
          "base-100": "#ffffff",      // Main background
          "base-200": "#f5f5f5",      // Secondary background
          "base-300": "#e5e5e5",      // Tertiary background
          "base-content": "#1a1a1a",  // Main text
          
          // Semantic colors (using grayscale)
          "primary": "#404040",        // Dark gray
          "primary-content": "#ffffff",
          "secondary": "#6b6b6b",      // Medium gray
          "secondary-content": "#ffffff",
          "accent": "#8a8a8a",         // Light gray
          "accent-content": "#ffffff",
          
          // State colors (using grayscale, except success for semantic online status)
          "neutral": "#2a2a2a",
          "neutral-content": "#ffffff",
          "info": "#5a5a5a",
          "info-content": "#ffffff",
          "success": "#22c55e",        // Green for online status
          "success-content": "#ffffff",
          "warning": "#6a6a6a",
          "warning-content": "#ffffff",
          "error": "#3a3a3a",
          "error-content": "#ffffff",
        },
        "monochrome-dark": {
          // Base colors
          "base-100": "#1a1a1a",      // Main background
          "base-200": "#2a2a2a",      // Secondary background
          "base-300": "#404040",      // Tertiary background
          "base-content": "#ffffff",  // Main text
          
          // Semantic colors (using grayscale)
          "primary": "#d4d4d4",        // Light gray
          "primary-content": "#1a1a1a",
          "secondary": "#a8a8a8",      // Medium gray
          "secondary-content": "#1a1a1a",
          "accent": "#8a8a8a",         // Dark gray
          "accent-content": "#ffffff",
          
          // State colors (using grayscale, except success for semantic online status)
          "neutral": "#e5e5e5",
          "neutral-content": "#1a1a1a",
          "info": "#b8b8b8",
          "info-content": "#1a1a1a",
          "success": "#22c55e",        // Green for online status
          "success-content": "#ffffff",
          "warning": "#9a9a9a",
          "warning-content": "#1a1a1a",
          "error": "#d8d8d8",
          "error-content": "#1a1a1a",
        }
      }
    ],
    darkTheme: "monochrome-dark",
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
  },
};
