import { getArticleBySlug, searchArticles } from '../cms';

describe('cms helpers', () => {
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
    const original = global.fetch;    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
    const results = await searchArticles('single malt');
    expect(results.length).toBeGreaterThan(0);
    global.fetch = original;
  });
});
