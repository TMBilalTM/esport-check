import { NextResponse } from 'next/server';
import { scrapeVLRTeams } from '@/lib/scrapers/vlr';
import { scrapeHLTVTeams } from '@/lib/scrapers/hltv';
import { FALLBACK_TEAMS } from '@/lib/fallback-data';
import type { Team } from '@/types';

// Cache
let cachedTeams: Team[] = [];
let lastFetch = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const game = searchParams.get('game');

    // Cache kontrolü
    const now = Date.now();
    if (cachedTeams.length > 0 && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(filterTeams(cachedTeams, platform, game));
    }

    // Paralel olarak tüm platformlardan veri çek
    const [vlrTeams, hltvTeams] = await Promise.all([
      scrapeVLRTeams().catch(err => {
        console.error('VLR teams error:', err);
        return [];
      }),
      scrapeHLTVTeams().catch(err => {
        console.error('HLTV teams error:', err);
        return [];
      }),
    ]);

    cachedTeams = [...vlrTeams, ...hltvTeams];
    
    // Hiç veri yoksa fallback kullan
    if (cachedTeams.length === 0) {
      console.log('No scraped teams, using fallback data');
      cachedTeams = FALLBACK_TEAMS;
    }
    
    lastFetch = now;

    const filtered = filterTeams(cachedTeams, platform, game);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

function filterTeams(
  teams: Team[],
  platform: string | null,
  game: string | null
): Team[] {
  let filtered = [...teams];

  if (platform && platform !== 'all') {
    filtered = filtered.filter(t => t.platform === platform);
  }

  if (game && game !== 'all') {
    filtered = filtered.filter(t => t.game === game);
  }

  return filtered;
}
