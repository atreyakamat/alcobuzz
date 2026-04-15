import Link from 'next/link';
import { Section } from '@alcobuzz/ui';
import { getArticles, getCategories, getMagazines } from '@alcobuzz/lib';
import { ArticleCard } from '@/components/article-card';
import { NewsletterForm } from '@/components/newsletter-form';

export default async function HomePage() {
  const [allArticles, categories, magazines] = await Promise.all([getArticles(), getCategories(), getMagazines()]);
  const featured = allArticles[0];

  return (
    <div className="space-y-14">
      <section className="grid gap-6 md:grid-cols-12">
        <article className="md:col-span-8">
          <ArticleCard article={featured} />
        </article>
        <aside className="space-y-4 rounded bg-accent/10 p-4 md:col-span-4">
          <h1 className="font-serif text-4xl">Editorial-first. Culture-forward.</h1>
          <p className="text-black/70">A premium magazine platform for the modern beverage industry.</p>
          <NewsletterForm />
        </aside>
      </section>

      <Section title="Trending & Latest">
        <div className="grid gap-6 md:grid-cols-3">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Section>

      <Section title="Categories">
        <div className="grid gap-3 md:grid-cols-5">
          {categories.map((category) => (
            <Link key={category} href={`/category/${category}`} className="rounded border px-4 py-3 text-center capitalize hover:bg-black hover:text-white">
              {category}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Magazine Spotlight">
        <div className="grid gap-6 md:grid-cols-2">
          {magazines.map((issue) => (
            <Link key={issue.issue} href={`/magazine/${issue.issue}`} className="rounded border p-4 hover:border-accent">
              <h3 className="font-serif text-2xl">{issue.title}</h3>
              <p className="text-black/70">{issue.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
