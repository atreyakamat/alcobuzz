'use client';

import { useState } from 'react';
import type { Article } from '@alcobuzz/lib';
import { ArticleCard } from '@/components/article-card';

export function CategoryView({ slug, articles }: { slug: string; articles: Article[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

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
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
