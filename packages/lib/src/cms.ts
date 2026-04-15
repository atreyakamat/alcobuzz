import { articles, categories, magazines } from './mock-data';
import type { Article, MagazineIssue } from './types';

const API_URL = process.env.STRAPI_API_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchFromCMS<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error('CMS not configured');
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const data = await fetchFromCMS<{ data: Article[] }>('/api/articles');
    return data.data;
  } catch {
    return articles;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const list = await getArticles();
  return list.find((a) => a.slug === slug) ?? null;
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const list = await getArticles();
  return list.filter((a) => a.category === category);
}

export async function searchArticles(query: string, category?: string, tag?: string): Promise<Article[]> {
  const list = await getArticles();
  return list.filter((a) => {
    const q = query.trim().toLowerCase();
    const queryMatch = !q || [a.title, a.excerpt, a.content, ...a.tags].join(' ').toLowerCase().includes(q);
    const categoryMatch = !category || a.category === category;
    const tagMatch = !tag || a.tags.includes(tag);
    return queryMatch && categoryMatch && tagMatch;
  });
}

export async function getCategories(): Promise<string[]> {
  return [...categories];
}

export async function getMagazines(): Promise<MagazineIssue[]> {
  try {
    const data = await fetchFromCMS<{ data: MagazineIssue[] }>('/api/magazines');
    return data.data;
  } catch {
    return magazines;
  }
}

export async function getMagazineIssue(issue: string): Promise<MagazineIssue | null> {
  const list = await getMagazines();
  return list.find((m) => m.issue === issue) ?? null;
}
