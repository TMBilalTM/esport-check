import axios from 'axios';
import type { Match, Team } from '@/types';

const VLR_API_URL = 'https://vlr.orlandomm.net/api/v1';

export async function scrapeVLRMatches(): Promise<Match[]> {
  try {
    const response = await axios.get(`${VLR_API_URL}/matches`, {
      timeout: 15000,
    });

    console.log('VLR API Full Response:', JSON.stringify(response.data, null, 2).substring(0, 500));
    
    const data = response.data?.data || response.data;
    const matches: Match[] = [];

    // VLR API farklı format kullanıyor, segments veya direkt matches olabilir
    const segments = data?.segments || [];
    
    console.log('VLR segments count:', segments.length);

    for (const segment of segments) {
      const matchItems = segment.matches || [];
      
      for (const matchData of matchItems) {
        try {
          if (!matchData.teams || matchData.teams.length < 2) continue;

          const team1Data = matchData.teams[0];
          const team2Data = matchData.teams[1];

          // Match status
          let status: 'live' | 'upcoming' | 'completed' = 'upcoming';
          if (matchData.state === 'live') status = 'live';
          else if (matchData.state === 'completed') status = 'completed';

          // Parse time
          const startTime = matchData.date ? new Date(matchData.date) : new Date();

          const match: Match = {
            id: `vlr-${matchData.id}`,
            platform: 'vlr',
            game: 'valorant',
            status,
            startTime,
            team1: {
              team: {
                id: `team-vlr-${team1Data.id}`,
                name: team1Data.name || 'TBD',
                shortName: team1Data.code,
                logo: team1Data.img ? (team1Data.img.startsWith('http') ? team1Data.img : `https://www.vlr.gg${team1Data.img}`) : '',
                game: 'valorant',
                platform: 'vlr',
                brandColor: '#ff4654',
              },
              score: team1Data.score || 0,
            },
            team2: {
              team: {
                id: `team-vlr-${team2Data.id}`,
                name: team2Data.name || 'TBD',
                shortName: team2Data.code,
                logo: team2Data.img ? (team2Data.img.startsWith('http') ? team2Data.img : `https://www.vlr.gg${team2Data.img}`) : '',
                game: 'valorant',
                platform: 'vlr',
                brandColor: '#ff4654',
              },
              score: team2Data.score || 0,
            },
            tournament: {
              id: `tournament-vlr-${matchData.tournament?.id || 'unknown'}`,
              name: matchData.tournament?.name || 'VCT Tournament',
              tier: 'S-Tier',
            },
            format: 'Bo3',
          };

          matches.push(match);
        } catch (err) {
          console.error('Error parsing VLR match:', err);
        }
      }
    }

    return matches;
  } catch (error) {
    console.error('VLR API error:', error);
    return [];
  }
}

export async function scrapeVLRTeams(): Promise<Team[]> {
  try {
    const response = await axios.get(`${VLR_API_URL}/teams`, {
      timeout: 15000,
      params: {
        limit: 50 // Get top 50 teams
      }
    });

    const teamsData = response.data?.data || [];
    const teams: Team[] = [];

    console.log('VLR Teams API Response sample:', JSON.stringify(teamsData[0], null, 2));

    teamsData.forEach((teamData: any, index: number) => {
      try {
        if (!teamData.name) return;

        const team: Team = {
          id: `team-vlr-${teamData.id}`,
          name: teamData.name,
          shortName: teamData.name.substring(0, 3).toUpperCase(), // Basic shortname generation since API doesn't provide it
          logo: teamData.img ? (teamData.img.startsWith('http') ? teamData.img : (teamData.img.startsWith('//') ? `https:${teamData.img}` : `https://www.vlr.gg${teamData.img}`)) : '',
          game: 'valorant',
          platform: 'vlr',
          ranking: index + 1, // Assuming order implies rank/relevance
          region: teamData.country || 'International',
          brandColor: '#ff4654',
        };

        teams.push(team);
      } catch (err) {
        console.error('Error parsing VLR team:', err);
      }
    });

    return teams;
  } catch (error) {
    console.error('VLR teams API error:', error);
    return [];
  }
}
