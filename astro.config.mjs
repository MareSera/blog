import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import terser from "@rollup/plugin-terser";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { compression } from "vite-plugin-compression2";
import { CODE_THEME, USER_SITE } from "./src/config.ts";

import updateConfig from "./src/integration/updateConfig.ts";

import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// https://astro.build/config
export default defineConfig({
  site: USER_SITE,
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  style: {
    scss: {
      includePaths: ["./src/styles"],
    },
  },
  integrations: [
    updateConfig(),
    mdx(),
    icon(),
    terser({
      compress: true,
      mangle: true,
    }),
    sitemap(),
    tailwind({
      configFile: "./tailwind.config.mjs",
    }),
    playformCompress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
      transformers: [{
        preprocess(code, options) {
          this.meta = { lang: options.lang || "plaintext" };
          return code;
        },
        pre(node) {
          const language = this.meta?.lang.toUpperCase() || "plaintext";

          return {
            type: "element",
            tagName: "div",
            properties: {
              class: "not-prose frosti-code",
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: {
                  class: "frosti-code-toolbar",
                },
                children: [
                  {
                    type: "element",
                    tagName: "span",
                    properties: { class: "frosti-code-toolbar-language" },
                    children: [{ type: "text", value: language }],
                  },
                  {
                    type: "element",
                    tagName: "button",
                    properties: {
                      "class": "btn-copy",
                      "aria-label": "Copy code",
                      "type": "button",
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          "class": "frosti-code-toolbar-copy-icon",
                          "aria-hidden": "true",
                        },
                        children: [
                          {
                            type: "element",
                            tagName: "svg",
                            properties: {
                              "xmlns": "http://www.w3.org/2000/svg",
                              "width": "18",
                              "height": "18",
                              "viewBox": "0 0 24 24",
                              "fill": "none",
                              "stroke": "currentColor",
                              "stroke-width": "2",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "class": "copy-icon",
                            },
                            children: [
                              {
                                type: "element",
                                tagName: "rect",
                                properties: {
                                  x: "9",
                                  y: "9",
                                  width: "13",
                                  height: "13",
                                  rx: "2",
                                  ry: "2",
                                },
                                children: [],
                              },
                              {
                                type: "element",
                                tagName: "path",
                                properties: {
                                  d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          "class": "frosti-code-toolbar-copy-success hidden",
                          "aria-hidden": "true",
                        },
                        children: [
                          {
                            type: "element",
                            tagName: "svg",
                            properties: {
                              "xmlns": "http://www.w3.org/2000/svg",
                              "width": "18",
                              "height": "18",
                              "viewBox": "0 0 24 24",
                              "fill": "none",
                              "stroke": "currentColor",
                              "stroke-width": "2",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "class": "success-icon",
                            },
                            children: [
                              {
                                type: "element",
                                tagName: "path",
                                properties: {
                                  d: "M20 6L9 17l-5-5",
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                ...node,
                properties: {
                  ...node.properties,
                  class: "frosti-code-content",
                },
                children: [
                  {
                    type: "element",
                    tagName: "code",
                    properties: {
                      class: "grid [&>.line]:px-4",
                      style: "counter-reset: line",
                    },
                    children: node.children,
                  },
                ],
              },
            ],
          };
        },
        line(node) {
          return {
            ...node,
            properties: {
              ...node.properties,
              class: "line before:content-[counter(line)]",
              style: "counter-increment: line",
            },
          };
        },
        code(node) {
          delete node.properties.style;
          return node;
        },
      },
      ],
    },
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex, [
      rehypeExternalLinks,
      {
        content: { type: "text", value: "↗" },
      },
    ]],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    build: {
      // 代码分割：将第三方库打包为独立 vendor chunk
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/katex')) return 'vendor-katex';
            if (id.includes('node_modules/medium-zoom')) return 'vendor-medium-zoom';
            if (id.includes('node_modules/@swup') || id.includes('node_modules/swup')) return 'vendor-swup';
            if (id.includes('node_modules/@pagefind')) return 'vendor-pagefind';
          },
        },
      },
      // 4KB 以下图片内联为 base64，减少 HTTP 请求
      assetsInlineLimit: 4096,
      // 超过 100KB 的 chunk 触发警告
      chunkSizeWarningLimit: 100,
    },
    plugins: [
      // Brotli 压缩：生成 .br 文件
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024, // 仅压缩大于 1KB 的文件
      }),
    ],
  },
});
