import Link from 'next/link';
import Image from 'next/image';
import { getMagazineIssue, getMagazines } from '@alcobuzz/lib';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const issues = await getMagazines();
  return issues.map((i) => ({ issue: i.issue }));
}

export default async function MagazineIssuePage({ params }: { params: Promise<{ issue: string }> }) {
  const { issue: issueSlug } = await params;
  const issue = await getMagazineIssue(issueSlug);
  if (!issue) {
    notFound();
  }

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <Image src={issue.coverImage} alt={issue.title} width={700} height={1000} className="w-full rounded object-cover" />
      <div className="space-y-4">
        <h1 className="font-serif text-5xl">{issue.title}</h1>
        <p>{issue.description}</p>
        <div className="flex gap-3">
          <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className="rounded bg-black px-4 py-2 text-white">Read online</a>
          <Link href={`/magazine/${issue.issue}/read`} className="rounded border px-4 py-2">Open flipbook</Link>
        </div>
      </div>
    </section>
  );
}
