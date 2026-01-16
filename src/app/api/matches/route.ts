import { NextResponse } from 'next/server';
import { scrapeVLRMatches } from '@/lib/scrapers/vlr';
import { scrapeHLTVMatches } from '@/lib/scrapers/hltv';
import { FALLBACK_MATCHES } from '@/lib/fallback-data';
import type { Match } from '@/types';

// Cache için
let cachedMatches: Match[] = [];
let lastFetch = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 dakika

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const game = searchParams.get('game');
    const status = searchParams.get('status');

    // Cache kontrolü
    const now = Date.now();
    if (cachedMatches.length > 0 && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(filterMatches(cachedMatches, platform, game, status));
    }

    // Paralel olarak tüm platformlardan veri çek
    const [vlrMatches, hltvMatches] = await Promise.all([
      scrapeVLRMatches().catch(err => {
        console.error('VLR error:', err);
        return [];
      }),
      scrapeHLTVMatches().catch(err => {
        console.error('HLTV error:', err);
        return [];
      }),
    ]);

    // Tüm maçları birleştir
    cachedMatches = [...vlrMatches, ...hltvMatches];
    
    // Hiç veri yoksa fallback kullan
    if (cachedMatches.length === 0) {
      console.log('No scraped data, using fallback matches');
      cachedMatches = FALLBACK_MATCHES;
    }
    
    lastFetch = now;

    // Tarihe göre sırala
    cachedMatches.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const filtered = filterMatches(cachedMatches, platform, game, status);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Matches API error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

function filterMatches(
  matches: Match[],
  platform: string | null,
  game: string | null,
  status: string | null
): Match[] {
  let filtered = [...matches];

  if (platform && platform !== 'all') {
    filtered = filtered.filter(m => m.platform === platform);
  }

  if (game && game !== 'all') {
    filtered = filtered.filter(m => m.game === game);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(m => m.status === status);
  }

  return filtered;
}
