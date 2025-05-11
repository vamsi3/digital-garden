// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { remarkSetTitleFromFilename } from './src/plugins/remark-set-title-from-filename.mts';

// https://astro.build/config
export default defineConfig({
  site: 'https://vamsi3.github.io',
  base: '/digital-garden',
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: "Vamsi's Digital Garden",
      logo: {
        light: './src/assets/logo-light.webp',
        dark: './src/assets/logo-light.webp', // TODO: Fix dark logo and update
      },
      editLink: {
        baseUrl: 'https://github.com/vamsi3/digital-garden/edit/main/',
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/vamsi3",
        },
      ],
      pagination: false,
      // Custom CSS to style KaTeX equations.
      customCss: [
        './src/styles/katex.css'
      ],
      // Load KaTeX required CSS.
      head: [
        {
          tag: 'link',
          attrs: {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
            rel: 'stylesheet',
            integrity: "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
            crossorigin: "anonymous"
          },
        },
      ],
      "tableOfContents": {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkSetTitleFromFilename,
    ],
    rehypePlugins: [
      rehypeKatex
    ],
  },
});
