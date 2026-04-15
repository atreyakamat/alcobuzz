import Link from 'next/link';

const nav = ['whisky', 'agave', 'bars', 'culture', 'industry'];

export function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-3xl font-bold">Alcobuzz</Link>
        <nav className="flex gap-4 text-sm" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item} href={`/category/${item}`} className="capitalize hover:text-accent">
              {item}
            </Link>
          ))}
          <Link href="/magazine">Magazine</Link>
        </nav>
      </div>
    </header>
  );
}
