import { getArticlesByCategory } from '@alcobuzz/lib';
import { CategoryView } from '@/components/category-view';

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const [{ slug }, { tag }] = await Promise.all([params, searchParams]);
  const articles = await getArticlesByCategory(slug);
  const filtered = tag ? articles.filter((a) => a.tags.includes(tag)) : articles;

  return <CategoryView slug={slug} articles={filtered} />;
}
