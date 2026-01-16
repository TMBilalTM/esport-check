import axios from 'axios';
import type { Match, Team } from '@/types';

const HLTV_API_URL = 'https://hltv-api.vercel.app/api';

export async function scrapeHLTVMatches(): Promise<Match[]> {
  try {
    const response = await axios.get(`${HLTV_API_URL}/matches.json`, {
      timeout: 15000,
    });

    const matchesData = response.data || [];
    const matches: Match[] = [];

    console.log('HLTV API Response sample:', JSON.stringify(matchesData[0], null, 2));

    for (const matchData of matchesData) {
      try {
        // HLTV API teams array kullanıyor
        const teams = matchData.teams || [];
        if (teams.length < 2) continue;

        const team1Data = teams[0];
        const team2Data = teams[1];

        // Parse date
        const startTime = matchData.time ? new Date(matchData.time) : new Date();

        // Status - HLTV API'de upcoming matches
        const status: 'live' | 'upcoming' | 'completed' = matchData.live ? 'live' : 'upcoming';

        const match: Match = {
          id: `hltv-${matchData.id}`,
          platform: 'hltv',
          game: 'cs2',
          status,
          startTime,
          team1: {
            team: {
              id: `team-hltv-${team1Data.id}`,
              name: team1Data.name || 'TBD',
              logo: team1Data.logo || '',
              game: 'cs2',
              platform: 'hltv',
              brandColor: '#de9b35',
            },
            score: 0,
          },
          team2: {
            team: {
              id: `team-hltv-${team2Data.id}`,
              name: team2Data.name || 'TBD',
              logo: team2Data.logo || '',
              game: 'cs2',
              platform: 'hltv',
              brandColor: '#de9b35',
            },
            score: 0,
          },
          tournament: {
            id: `tournament-hltv-${matchData.event?.id || 'unknown'}`,
            name: matchData.event?.name || 'CS2 Tournament',
            tier: 'A-Tier',
          },
          format: matchData.format || 'Bo3',
        };

        matches.push(match);
      } catch (err) {
        console.error('Error parsing HLTV match:', err);
      }
    }

    return matches;
  } catch (error) {
    console.error('HLTV API error:', error);
    return [];
  }
}

export async function scrapeHLTVTeams(): Promise<Team[]> {
  try {
    // Since /teams endpoint is unreliable, we extract teams from matches
    const response = await axios.get(`${HLTV_API_URL}/matches.json`, {
      timeout: 15000,
    });

    const matchesData = response.data || [];
    const teamsMap = new Map<string, Team>();

    for (const matchData of matchesData) {
      if (!matchData.teams || matchData.teams.length < 2) continue;

      matchData.teams.forEach((teamData: any) => {
        if (!teamData.id || !teamData.name || teamsMap.has(String(teamData.id))) return;

        // Try to extract country if available in players or elsewhere, otherwise default
        // The API match object doesn't expose team country directly usually, 
        // but let's check if we can infer or leave it as International for now.
        // We can try to use logo to guess or just leave it.

        teamsMap.set(String(teamData.id), {
          id: `team-hltv-${teamData.id}`,
          name: teamData.name,
          logo: teamData.logo ? (teamData.logo.startsWith('http') ? teamData.logo : (teamData.logo.startsWith('//') ? `https:${teamData.logo}` : `https://www.hltv.org${teamData.logo}`)) : '',
          game: 'cs2',
          platform: 'hltv',
          ranking: 0, // No ranking info in matches
          region: 'International', // Default for now
          brandColor: '#de9b35',
        });
      });
    }

    return Array.from(teamsMap.values());
  } catch (error) {
    console.error('HLTV teams API error:', error);
    return [];
  }
}
