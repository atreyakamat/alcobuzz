import type { Article, MagazineIssue } from './types';

export const categories = ['whisky', 'agave', 'bars', 'culture', 'industry'] as const;

export const articles: Article[] = [
  {
    id: 1,
    title: 'The New Golden Age of Single Malt',
    slug: 'golden-age-single-malt',
    excerpt: 'A global look at terroir-driven whisky making and modern cask innovation.',
    content: '<p>Single malt is redefining premium drinking culture with nuanced storytelling.</p>',
    coverImage: 'https://images.unsplash.com/photo-1582819509237-dce630f2f2cb?auto=format&fit=crop&w=1200&q=80',
    author: 'Aditi Rao',
    tags: ['single-malt', 'premium', 'distillery'],
    category: 'whisky',
    publishedAt: '2026-03-14'
  },
  {
    id: 2,
    title: 'Agave Futures: Craft Meets Scale',
    slug: 'agave-futures-craft-meets-scale',
    excerpt: 'How agave producers navigate authenticity, demand, and sustainability.',
    content: '<p>Agave brands are balancing artisanal roots with global distribution.</p>',
    coverImage: 'https://images.unsplash.com/photo-1514361892635-6edc58d2e7f8?auto=format&fit=crop&w=1200&q=80',
    author: 'Nikhil Batra',
    tags: ['mezcal', 'tequila', 'supply-chain'],
    category: 'agave',
    publishedAt: '2026-03-20'
  },
  {
    id: 3,
    title: 'Inside Asia’s Most Cinematic Cocktail Bars',
    slug: 'asias-cinematic-cocktail-bars',
    excerpt: 'A visual-led journey into the world’s most design-forward bars.',
    content: '<p>Bars are becoming immersive stages for hospitality and culture.</p>',
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    author: 'Sara D\'Costa',
    tags: ['cocktails', 'design', 'asia'],
    category: 'bars',
    publishedAt: '2026-03-28'
  }
];

export const magazines: MagazineIssue[] = [
  {
    issue: '2026-apr',
    title: 'Alcobuzz April 2026',
    description: 'The style issue for tastemakers and modern beverage culture.',
    coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedAt: '2026-04-01'
  }
];
