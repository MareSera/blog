/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from "@iconify/tailwind";
import typography from "@tailwindcss/typography";
import daisyUI from "daisyui";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Delius', 'RawMarukoGothicCJKtc', 'KeinannMaruPOP-JP', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
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
          // Base colors - lighter and softer
          "base-100": "#ffffff",      // Main background (pure white)
          "base-200": "#fafafa",      // Secondary background (very light gray)
          "base-300": "#f0f0f0",      // Tertiary background (soft gray)
          "base-content": "#404040",  // Main text (medium gray instead of dark)
          
          // Semantic colors (lighter grayscale)
          "primary": "#707070",        // Medium gray (lighter)
          "primary-content": "#ffffff",
          "secondary": "#909090",      // Light gray
          "secondary-content": "#ffffff",
          "accent": "#a8a8a8",         // Very light gray
          "accent-content": "#ffffff",
          
          // State colors (lighter, except success)
          "neutral": "#606060",
          "neutral-content": "#ffffff",
          "info": "#808080",
          "info-content": "#ffffff",
          "success": "#22c55e",        // Green for online status
          "success-content": "#ffffff",
          "warning": "#909090",
          "warning-content": "#ffffff",
          "error": "#707070",
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
