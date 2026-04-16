import type { Article } from './types';

export function articleJsonLd(article: Article, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.coverImage],
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.publishedAt,
    mainEntityOfPage: `${siteUrl}/articles/${article.slug}`
  };
}
