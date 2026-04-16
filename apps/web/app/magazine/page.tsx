import Link from 'next/link';
import Image from 'next/image';
import { getMagazines } from '@alcobuzz/lib';

export default async function MagazinePage() {
  const issues = await getMagazines();
  return (
    <section className="space-y-6">
      <h1 className="font-serif text-5xl">Magazine Rack</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {issues.map((issue) => (
          <Link key={issue.issue} href={`/magazine/${issue.issue}`} className="space-y-2 rounded border p-3">
            <Image src={issue.coverImage} alt={issue.title} width={500} height={700} className="h-80 w-full object-cover" />
            <h2 className="font-serif text-2xl">{issue.title}</h2>
            <p className="text-sm text-black/70">{issue.publishedAt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
