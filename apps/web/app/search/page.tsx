import { searchArticles } from '@alcobuzz/lib';
import { ArticleCard } from '@/components/article-card';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? '';
  const results = await searchArticles(q, params.category, params.tag);

  return (
    <section className="space-y-6">
      <h1 className="font-serif text-5xl">Search</h1>
      <p className="text-black/70">{results.length} result(s) for “{q}”</p>
      <div className="grid gap-6 md:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
