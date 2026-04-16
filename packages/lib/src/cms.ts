import { articles, categories, magazines } from './mock-data';
import type { Article, MagazineIssue } from './types';

type CmsProvider = 'strapi' | 'wordpress';

const DEFAULT_ARTICLE_COVER =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_MAGAZINE_COVER =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80';
const DEFAULT_MAGAZINE_PDF = '/placeholder-magazine.pdf';
const DEFAULT_ARTICLE_TITLE = 'Untitled Story';
const DEFAULT_MAGAZINE_TITLE = 'Alcobuzz Issue';

type WPRendered = { rendered: string };
type WPTerm = { name: string; slug: string; taxonomy?: string };
type WPAuthor = { name: string };
type WPFeaturedMedia = { source_url: string };

type WPEmbedded = {
  author?: WPAuthor[];
  'wp:featuredmedia'?: WPFeaturedMedia[];
  'wp:term'?: WPTerm[][];
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  excerpt?: WPRendered;
  content?: WPRendered;
  _embedded?: WPEmbedded;
  acf?: {
    issue?: string;
    description?: string;
    pdfUrl?: string;
    pdf_url?: string;
  };
  meta?: Record<string, string | undefined>;
};

function getCmsProvider(): CmsProvider {
  const value = process.env.CMS_PROVIDER?.toLowerCase();
  return value === 'wordpress' ? 'wordpress' : 'strapi';
}

function getStrapiConfig() {
  return {
    apiUrl: process.env.STRAPI_API_URL,
    apiToken: process.env.STRAPI_API_TOKEN
  };
}

function getWordPressConfig() {
  return {
    apiUrl: process.env.WORDPRESS_API_URL,
    username: process.env.WORDPRESS_API_USER,
    appPassword: process.env.WORDPRESS_API_APP_PASSWORD
  };
}


function getWordPressMagazinePostType(): string {
  return process.env.WORDPRESS_MAGAZINE_POST_TYPE ?? 'magazine_issue';
}

function stripHtml(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeCategory(value: string): Article['category'] | null {
  const normalized = value.toLowerCase().trim();
  const mapped = {
    whiskey: 'whisky',
    whisky: 'whisky',
    agave: 'agave',
    bars: 'bars',
    bar: 'bars',
    culture: 'culture',
    industry: 'industry'
  } as const;

  return mapped[normalized as keyof typeof mapped] ?? null;
}

function getEmbeddedTerms(post: WPPost): WPTerm[] {
  return post._embedded?.['wp:term']?.flatMap((termGroup) => termGroup) ?? [];
}

async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchFromStrapi<T>(path: string): Promise<T> {
  const { apiUrl, apiToken } = getStrapiConfig();
  if (!apiUrl) {
    throw new Error('Strapi CMS not configured');
  }

  return fetchJson<T>(`${apiUrl}${path}`, apiToken ? { Authorization: `Bearer ${apiToken}` } : {});
}

async function fetchFromWordPress<T>(path: string): Promise<T> {
  if (typeof window !== 'undefined') {
    throw new Error('WordPress fetch is server-only');
  }

  const { apiUrl, username, appPassword } = getWordPressConfig();
  if (!apiUrl) {
    throw new Error('WordPress CMS not configured');
  }

  if (username && appPassword && typeof Buffer === 'undefined') {
    throw new Error('Buffer is required for WordPress basic authentication');
  }

  const authHeader: Record<string, string> =
    username && appPassword
      ? {
          Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`
        }
      : {};

  return fetchJson<T>(`${apiUrl}${path}`, authHeader);
}

function mapWordPressPost(post: WPPost): Article {
  const terms = getEmbeddedTerms(post);
  const category =
    terms
      .map((term) => {
        const normalizedSlug = normalizeCategory(term.slug);
        const normalizedName = normalizeCategory(term.name);
        return normalizedSlug ?? normalizedName;
      })
      .find(Boolean) ?? 'culture';

  const tags = Array.from(
    new Set(
      terms
        .filter((term) => !normalizeCategory(term.slug) && !normalizeCategory(term.name))
        .map((term) => slugify(term.name))
        .filter(Boolean)
    )
  );

  return {
    id: post.id,
    title: stripHtml(post.title?.rendered) || DEFAULT_ARTICLE_TITLE,
    slug: post.slug,
    excerpt: stripHtml(post.excerpt?.rendered) || 'Read the latest story on Alcobuzz.',
    content: post.content?.rendered ?? '<p>Content coming soon.</p>',
    coverImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? DEFAULT_ARTICLE_COVER,
    author: post._embedded?.author?.[0]?.name ?? 'Alcobuzz Editorial',
    tags,
    category,
    publishedAt: post.date
  };
}


function getMagazinePdfUrl(post: WPPost): string {
  const acf = post.acf ?? {};
  const meta = post.meta ?? {};
  const pdfUrlCandidates = [acf.pdfUrl, acf.pdf_url, meta.pdfUrl, meta.pdf_url].filter(Boolean);
  return pdfUrlCandidates[0] ?? DEFAULT_MAGAZINE_PDF;
}

function mapWordPressMagazine(post: WPPost): MagazineIssue {
  const title = stripHtml(post.title?.rendered) || DEFAULT_MAGAZINE_TITLE;
  return {
    issue: post.acf?.issue ?? post.slug,
    title,
    description: post.acf?.description ?? (stripHtml(post.excerpt?.rendered) || `${title} digital issue`),
    coverImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? DEFAULT_MAGAZINE_COVER,
    pdfUrl: getMagazinePdfUrl(post),
    publishedAt: post.date
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    if (getCmsProvider() === 'wordpress') {
      const data = await fetchFromWordPress<WPPost[]>('/wp-json/wp/v2/posts?per_page=30&_embed=1');
      return data.map(mapWordPressPost);
    }

    const data = await fetchFromStrapi<{ data: Article[] }>('/api/articles');
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
  try {
    if (getCmsProvider() === 'wordpress') {
      let page = 1;
      let hasMore = true;
      const categoriesFromWordPress: Array<{ name: string; slug: string }> = [];

      while (hasMore) {
        const data = await fetchFromWordPress<Array<{ name: string; slug: string }>>(
          `/wp-json/wp/v2/categories?per_page=100&page=${page}`
        );

        categoriesFromWordPress.push(...data);
        hasMore = data.length === 100;
        page += 1;
      }

      const normalizedCategories = Array.from(
        new Set(
          categoriesFromWordPress
            .map((category) => normalizeCategory(category.slug) ?? normalizeCategory(category.name))
            .filter(Boolean)
        )
      ) as string[];
      return normalizedCategories.length ? normalizedCategories : [...categories];
    }
  } catch {
    return [...categories];
  }

  return [...categories];
}

export async function getMagazines(): Promise<MagazineIssue[]> {
  try {
    if (getCmsProvider() === 'wordpress') {
      const magazinePostType = getWordPressMagazinePostType();
      const data = await fetchFromWordPress<WPPost[]>(`/wp-json/wp/v2/${magazinePostType}?per_page=24&_embed=1`);
      const mapped = data.map(mapWordPressMagazine);
      return mapped.length ? mapped : magazines;
    }

    const data = await fetchFromStrapi<{ data: MagazineIssue[] }>('/api/magazines');
    return data.data;
  } catch {
    return magazines;
  }
}

export async function getMagazineIssue(issue: string): Promise<MagazineIssue | null> {
  const list = await getMagazines();
  return list.find((m) => m.issue === issue) ?? null;
}
