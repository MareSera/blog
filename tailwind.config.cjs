module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)'
        },
        fontFamily: {
          sans: ['"LXGW WenKai"', 'system-ui']
        }
      }
    }
  };
  