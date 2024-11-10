// https://astro.build/config
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import { serializeSitemap, shouldIndexPage } from './sitemap.mjs';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://github.com/nholuongut/',
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: function (element) {
            const href = element.properties.href;
            const whiteListedStarts = [
              '/',
              '#',
              'mailto:',
              'https://github.com/nholuongut',
              'https://github.com/nholuongut',
            ];
            if (whiteListedStarts.some((start) => href.startsWith(start))) {
              return [];
            }
            return 'noopener noreferrer nofollow';
          },
        },
      ],
    ],
  },
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  trailingSlash: 'never',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap({
      filter: shouldIndexPage,
      serialize: serializeSitemap,
    }),
    react(),
  ],
});
