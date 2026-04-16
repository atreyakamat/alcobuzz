import { getArticleBySlug, getArticles, searchArticles } from '../cms';

describe('cms helpers', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test('returns null for unknown slug', async () => {
    const article = await getArticleBySlug('missing-slug');
    expect(article).toBeNull();
  });

  test('search handles empty query and category filter', async () => {
    const results = await searchArticles('', 'agave');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.category === 'agave')).toBe(true);
  });

  test('search matches tags', async () => {
    const results = await searchArticles('tequila');
    expect(results.some((r) => r.slug === 'agave-futures-craft-meets-scale')).toBe(true);
  });

  test('falls back to local data when CMS fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    const results = await searchArticles('single malt');
    expect(results.length).toBeGreaterThan(0);
  });

  test('maps wordpress posts when provider is wordpress', async () => {
    process.env.CMS_PROVIDER = 'wordpress';
    process.env.WORDPRESS_API_URL = 'https://cms.example.com';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 11,
          slug: 'vogue-inspired-story',
          date: '2026-04-01T08:30:00',
          title: { rendered: 'Vogue Inspired Story' },
          excerpt: { rendered: '<p>Premium editorial test.</p>' },
          content: { rendered: '<p>Body</p>' },
          _embedded: {
            author: [{ name: 'Hostinger Editor' }],
            'wp:featuredmedia': [{ source_url: 'https://images.unsplash.com/photo-1' }],
            'wp:term': [[{ name: 'Whisky', slug: 'whisky' }, { name: 'Luxury', slug: 'luxury' }]]
          }
        }
      ]
    } as Response) as unknown as typeof fetch;

    const results = await getArticles();
    expect(results[0]).toMatchObject({
      slug: 'vogue-inspired-story',
      author: 'Hostinger Editor',
      category: 'whisky'
    });
    expect(results[0].tags).toContain('luxury');
  });
});
