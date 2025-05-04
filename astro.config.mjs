// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: 'https://vamsi3.github.io',
  base: '/digital-garden',
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: "Vamsi's Digital Garden",
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
    }),
  ],
});
