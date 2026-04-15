export type Category = 'whisky' | 'agave' | 'bars' | 'culture' | 'industry';

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  category: Category;
  publishedAt: string;
};

export type MagazineIssue = {
  issue: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  publishedAt: string;
};
