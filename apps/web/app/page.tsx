import Link from 'next/link';
import { Section } from '@alcobuzz/ui';
import { getArticles, getCategories, getMagazines } from '@alcobuzz/lib';
import { ArticleCard } from '@/components/article-card';
import { NewsletterForm } from '@/components/newsletter-form';

export default async function HomePage() {
  const [allArticles, categories, magazines] = await Promise.all([getArticles(), getCategories(), getMagazines()]);
  const featured = allArticles[0] ?? null;
  const secondary = allArticles.slice(1, 3);

  return (
    <div className="space-y-16">
      <section className="grid gap-8 border-b border-black/10 pb-10 md:grid-cols-12">
        <article className="space-y-6 md:col-span-8">
          {featured ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.25em] text-black/60">Cover Story</p>
              <h1 className="max-w-4xl text-5xl leading-none md:text-7xl">{featured.title}</h1>
              <p className="max-w-2xl text-lg text-black/70">{featured.excerpt}</p>
              <Link
                href={`/articles/${featured.slug}`}
                className="inline-flex border border-black px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white"
              >
                Read Feature
              </Link>
            </>
          ) : (
            <div className="rounded border border-black/10 p-6">
              <h2 className="text-3xl">No featured article yet</h2>
              <p className="text-black/70">Publish your first story from CMS to populate the hero section.</p>
            </div>
          )}
        </article>

        <aside className="space-y-6 bg-accent/15 p-6 md:col-span-4">
          <h2 className="text-3xl md:text-4xl">Editorial-first. Culture-forward.</h2>
          <p className="text-sm leading-relaxed text-black/75">
            A premium publishing destination inspired by magazine storytelling and modern beverage culture.
          </p>
          <NewsletterForm />
        </aside>
      </section>

      <Section title="Editor’s Picks">
        <div className="grid gap-8 md:grid-cols-2">
          {secondary.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Section>

      <Section title="Trending & Latest">
        <div className="grid gap-8 md:grid-cols-3">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Section>

      <Section title="Categories">
        <div className="grid gap-3 md:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="rounded-sm border border-black px-4 py-3 text-center text-xs uppercase tracking-[0.16em] hover:bg-black hover:text-white"
            >
              {category}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Magazine Spotlight">
        <div className="grid gap-6 md:grid-cols-2">
          {magazines.map((issue) => (
            <Link key={issue.issue} href={`/magazine/${issue.issue}`} className="rounded-sm border border-black/15 p-6 hover:border-black">
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/60">Issue of the Month</p>
              <h3 className="mt-2 text-3xl">{issue.title}</h3>
              <p className="mt-3 text-black/70">{issue.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
