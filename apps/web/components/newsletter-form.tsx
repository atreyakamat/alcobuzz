'use client';

import { FormEvent, useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setStatus(response.ok ? 'Subscribed!' : 'Subscription failed');
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="text-sm">Newsletter</label>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-black/20 px-3 py-2"
          placeholder="you@example.com"
        />
        <button className="rounded bg-accent px-3 py-2 font-medium">Join</button>
      </div>
      {status ? <p className="text-sm text-black/70">{status}</p> : null}
    </form>
  );
}
