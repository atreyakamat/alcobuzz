'use client';

import { use, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { articles } from '@alcobuzz/lib';
import { ArticleCard } from '@/components/article-card';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const selectedTag = searchParams.get('tag');

  const filtered = useMemo(
    () => articles.filter((a) => a.category === slug && (!selectedTag || a.tags.includes(selectedTag))),
    [slug, selectedTag]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-5xl capitalize">{slug}</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1" onClick={() => setView('grid')}>Grid</button>
          <button className="rounded border px-3 py-1" onClick={() => setView('list')}>List</button>
        </div>
      </div>
      <div className={view === 'grid' ? 'grid gap-6 md:grid-cols-3' : 'space-y-6'}>
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
