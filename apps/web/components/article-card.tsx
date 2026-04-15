import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@alcobuzz/lib';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="space-y-3">
      <Link href={`/articles/${article.slug}`} className="block overflow-hidden rounded">
        <Image src={article.coverImage} alt={article.title} width={600} height={360} className="h-56 w-full object-cover" />
      </Link>
      <p className="text-xs uppercase tracking-widest text-black/70">{article.category}</p>
      <h3 className="font-serif text-2xl leading-tight">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="text-sm text-black/70">{article.excerpt}</p>
    </article>
  );
}
