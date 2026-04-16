import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleJsonLd, getArticleBySlug, getArticles } from '@alcobuzz/lib';

type ArticleParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: ArticleParams }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: 'Article not found' };
  }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage]
    }
  };
}

export default async function ArticlePage({ params }: { params: ArticleParams }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const related = (await getArticles()).filter((item) => item.category === article.category && item.slug !== article.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article, siteUrl)) }} />
      <p className="text-xs uppercase tracking-widest">{article.category}</p>
      <h1 className="font-serif text-5xl">{article.title}</h1>
      <p className="text-black/70">By {article.author}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      <div className="flex gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-black px-3 py-1 text-xs text-white">#{tag}</span>
        ))}
      </div>
      <section className="space-y-3">
        <h2 className="font-serif text-3xl">Related Articles</h2>
        <ul className="list-inside list-disc">
          {related.map((item) => (
            <li key={item.id}><a href={`/articles/${item.slug}`}>{item.title}</a></li>
          ))}
        </ul>
      </section>
    </article>
  );
}
