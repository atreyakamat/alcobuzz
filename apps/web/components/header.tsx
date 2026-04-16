import Link from 'next/link';

const nav = ['whisky', 'agave', 'bars', 'culture', 'industry'];

export function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="border-b border-black/10 bg-black text-center text-[10px] uppercase tracking-[0.3em] text-white">
        <p className="mx-auto max-w-6xl px-4 py-2">Alcobuzz Editorial • Vogue-inspired digital magazine experience</p>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-serif text-4xl font-semibold uppercase tracking-widest">Alcobuzz</Link>
        <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em]" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item} href={`/category/${item}`} className="capitalize hover:text-accent">
              {item}
            </Link>
          ))}
          <Link href="/magazine" className="hover:text-accent">Magazine</Link>
        </nav>
      </div>
    </header>
  );
}
