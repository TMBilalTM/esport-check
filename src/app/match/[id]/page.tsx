import { notFound } from 'next/navigation';
import { MatchDetailClient } from '@/components/match/match-detail-client';
import { scrapeVLRMatches } from '@/lib/scrapers/vlr';
import { scrapeHLTVMatches } from '@/lib/scrapers/hltv';
import type { Match } from '@/types';

// Force dynamic rendering because we are fetching data
export const dynamic = 'force-dynamic';

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const matchId = resolvedParams.id;

  let match: Match | undefined;

  // Determine source based on ID prefix
  if (matchId.startsWith('vlr-')) {
    try {
      const matches = await scrapeVLRMatches();
      // VLR ids are usually just numbers in the scraper, but we prefix them.
      // scrapeVLRMatches returns items with id: `vlr-${matchData.id}`
      match = matches.find((m) => m.id === matchId);
    } catch (e) {
      console.error("Error scraping VLR matches for detail:", e);
    }
  } else if (matchId.startsWith('hltv-')) {
    try {
      const matches = await scrapeHLTVMatches();
      // scrapeHLTVMatches returns items with id: `hltv-${matchData.id}`
      match = matches.find((m) => m.id === matchId);
    } catch (e) {
      console.error("Error scraping HLTV matches for detail:", e);
    }
  } else {
    // Fallback: search in all
    try {
     const [vlrMatches, hltvMatches] = await Promise.all([
      scrapeVLRMatches().catch(() => []),
      scrapeHLTVMatches().catch(() => []), 
    ]);
    match = [...vlrMatches, ...hltvMatches].find((m) => m.id === matchId);
    } catch (e) {
      console.error("Error scraping all matches for detail fallback:", e);
    }
  }

  if (!match) {
    notFound();
  }

  return <MatchDetailClient match={match} />;
}
