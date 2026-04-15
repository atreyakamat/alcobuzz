import { notFound } from 'next/navigation';
import { getMagazineIssue } from '@alcobuzz/lib';
import { FlipbookViewer } from '@/components/flipbook-viewer';

export default async function MagazineReadPage({ params }: { params: Promise<{ issue: string }> }) {
  const { issue: issueSlug } = await params;
  const issue = await getMagazineIssue(issueSlug);
  if (!issue) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <h1 className="font-serif text-4xl">{issue.title} — Flipbook</h1>
      <FlipbookViewer pdfUrl={issue.pdfUrl} />
    </section>
  );
}
