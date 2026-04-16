import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="font-serif text-3xl text-black">{title}</h2>
      {children}
    </section>
  );
}

export function Chip({ label }: { label: string }) {
  return <span className="rounded-full bg-black px-3 py-1 text-xs text-white">{label}</span>;
}
