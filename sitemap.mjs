import path from 'node:path';
import fs from 'node:fs/promises';

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/roadmaps'));
}

async function getBestPracticesIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/best-practices'));
}

export function shouldIndexPage(pageUrl) {
  return ![
    'https://github.com/nholuongut/404',
    'https://github.com/nholuongut/terms',
    'https://github.com/nholuongut/privacy',
    'https://github.com/nholuongut/pdfs',
    'https://github.com/nholuongut/g',
  ].includes(pageUrl);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'https://github.com/nholuongut',
    'https://github.com/nholuongut/about',
    'https://github.com/nholuongut/roadmaps',
    'https://github.com/nholuongut/best-practices',
    'https://github.com/nholuongut/guides',
    'https://github.com/nholuongut/videos',
    ...(await getRoadmapIds()).flatMap((id) => [
      `https://github.com/nholuongut/${id}`,
      `https://github.com/nholuongut/${id}/topics`,
    ]),
    ...(await getBestPracticesIds()).map(
      (id) => `https://github.com/nholuongut/best-practices/${id}`
    ),
  ];

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (
    item.url.startsWith('https://github.com/nholuongut/guides') ||
    item.url.startsWith('https://github.com/nholuongut/videos')
  ) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}
