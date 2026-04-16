import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@alcobuzz/lib';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="space-y-4 border-b border-black/10 pb-6">
      <Link href={`/articles/${article.slug}`} className="group block overflow-hidden rounded-sm">
        <Image
          src={article.coverImage}
          alt={article.title}
          width={600}
          height={360}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <p className="text-[11px] uppercase tracking-[0.22em] text-black/70">{article.category}</p>
      <h3 className="text-2xl leading-tight md:text-[2rem]">
        <Link href={`/articles/${article.slug}`} className="hover:text-black/70">{article.title}</Link>
      </h3>
      <p className="text-sm leading-relaxed text-black/70">{article.excerpt}</p>
    </article>
  );
}
