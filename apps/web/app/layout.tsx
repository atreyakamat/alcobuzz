import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { Analytics } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Alcobuzz',
  description: 'Premium editorial media platform for alco-beverage culture'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <Header />
        <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
          <Suspense fallback={<div className="h-10 animate-pulse rounded bg-black/10" />}>
            <SearchBar />
          </Suspense>
          {children}
        </main>
      </body>
    </html>
  );
}
