import type { MetadataRoute } from 'next';
import { getArticles, getMagazines } from '@alcobuzz/lib';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const [articles, magazines] = await Promise.all([getArticles(), getMagazines()]);

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/magazine` },
    ...articles.map((article) => ({ url: `${siteUrl}/articles/${article.slug}` })),
    ...magazines.map((issue) => ({ url: `${siteUrl}/magazine/${issue.issue}` }))
  ];
}
