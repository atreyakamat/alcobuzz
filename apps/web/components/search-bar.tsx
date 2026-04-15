'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2" role="search" aria-label="Global search">
      <input
        className="w-full rounded border border-black/20 px-4 py-2"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles, tags, brands"
      />
      <button className="rounded bg-black px-4 py-2 text-white hover:bg-accent hover:text-black">Search</button>
    </form>
  );
}
