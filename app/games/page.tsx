import { headers } from 'next/headers';

async function getGames() {
  const h = headers();
  const host = h.get('host')!;
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `${proto}://${host}`;
  const url = new URL('/api/games', base);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}
