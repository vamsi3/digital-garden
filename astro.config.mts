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
    // https://starlight.astro.build/reference/configuration
    starlight({
      title: "Vamsi's Digital Garden",
      description: "Vamsi's Digital Garden",
      logo: {
        light: './src/assets/logo-light.webp',
        dark: './src/assets/logo-light.webp', // TODO: Fix dark logo and update
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
      editLink: {
        baseUrl: 'https://github.com/vamsi3/digital-garden/edit/main/',
      },
      sidebar: [
        {
          label: 'Clean',
          autogenerate: { directory: 'clean', collapsed: false },
        },
        {
          label: 'Archive',
          collapsed: true,
          autogenerate: { directory: 'archive', collapsed: true },
        }
      ],
      defaultLocale: 'en',
      locales: {
        // TODO: Figure out how to set root.
        // root: {
        //   label: 'English',
        //   lang: 'en',
        // },
  
        // English docs in `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Telugu docs in `src/content/docs/te/`
        te: {
          label: 'తెలుగు'
        },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/vamsi3",
        },
      ],
      customCss: [
        './src/styles/custom.css',
        './src/styles/katex.css',
        '@fontsource/commit-mono/400.css',
        '@fontsource/commit-mono/700.css',
      ],
      markdown: {
        headingLinks: true,
      },
      expressiveCode: {
        themes: ['ayu-dark', 'starlight-light'],
        useStarlightDarkModeSwitch: true,
        useStarlightUiThemeColors: true,

        // https://expressive-code.com/reference/configuration
        // all these options are instead defined in ec.config.mjs
      },
      lastUpdated: true,
      pagination: false,
      // TODO: Add favicon
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
