import type { PlatformConfig, Match, Team, GamePlatform, GameType, Player } from '@/types';

// API fonksiyonları
export async function fetchMatches(
  platform?: GamePlatform,
  game?: GameType,
  status?: string
): Promise<Match[]> {
  try {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    if (game) params.set('game', game);
    if (status) params.set('status', status);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/matches?${params.toString()}`, {
      next: { revalidate: 120 }, // 2 dakika cache
    });

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const data = await response.json();
    
    // Date string'lerini Date object'lerine çevir
    return data.map((match: any) => ({
      ...match,
      startTime: new Date(match.startTime),
    }));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function fetchTeams(platform?: GamePlatform, game?: GameType): Promise<Team[]> {
  try {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    if (game) params.set('game', game);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/teams?${params.toString()}`, {
      next: { revalidate: 600 }, // 10 dakika cache
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/match/${id}`, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      ...data,
      startTime: new Date(data.startTime),
    };
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
}

export async function fetchTeamById(id: string): Promise<Team | null> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/team/${id}`, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching team:', error);
    return null;
  }
}

// Platform Configurations
export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'vlr',
    name: 'VLR.gg',
    icon: 'https://www.vlr.gg/img/vlr/logo_header.png',
    games: ['valorant'],
    baseUrl: 'https://vlr.gg',
    color: '#ff4654',
    enabled: true,
  },
  {
    id: 'hltv',
    name: 'HLTV',
    icon: 'https://www.hltv.org/img/static/TopLogoDark2x.png',
    games: ['csgo', 'cs2'],
    baseUrl: 'https://hltv.org',
    color: '#2b6ea3',
    enabled: true,
  },
  {
    id: 'liquipedia',
    name: 'Liquipedia',
    icon: 'https://liquipedia.net/commons/extensions/TeamLiquidIntegration/resources/pagelogo/liquipedia_logo.png',
    games: ['valorant', 'csgo', 'cs2', 'lol', 'dota2', 'overwatch'],
    baseUrl: 'https://liquipedia.net',
    color: '#0f4c81',
    enabled: true,
  },
  {
    id: 'faceit',
    name: 'FACEIT',
    icon: 'https://corporate.faceit.com/wp-content/uploads/2016/10/FACEIT_Orange_Colour.png',
    games: ['csgo', 'cs2', 'valorant'],
    baseUrl: 'https://faceit.com',
    color: '#ff5500',
    enabled: true,
  },
];

export const GAMES: { id: GameType; name: string; icon: string; color: string }[] = [
  { id: 'valorant', name: 'VALORANT', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/100px-Valorant_logo_-_pink_color_version.svg.png', color: '#ff4654' },
  { id: 'cs2', name: 'Counter-Strike 2', icon: 'https://upload.wikimedia.org/wikipedia/commons/archive/b/b8/20230323152745%21Counter-Strike_2_logo.svg', color: '#de9b35' },
  { id: 'lol', name: 'League of Legends', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/League_of_Legends_2019_vector.svg/100px-League_of_Legends_2019_vector.svg.png', color: '#c89b3c' },
  { id: 'dota2', name: 'Dota 2', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dota_logo.svg/330px-Dota_logo.svg.png?20230404224843', color: '#a32628' },
  { id: 'overwatch', name: 'Overwatch 2', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/100px-Overwatch_circle_logo.svg.png', color: '#fa9c1e' },
  { id: 'rocketleague', name: 'Rocket League', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Rocket_League_logo.svg/1280px-Rocket_League_logo.svg.png?20200925050043', color: '#0072ce' },
];

// Mock Data Generator
const generateMockTeam = (
  name: string,
  game: GameType,
  platform: GamePlatform,
  logo: string,
  country: string,
  region: string,
  color: string
): Team => ({
  id: crypto.randomUUID(),
  name,
  shortName: name.substring(0, 3).toUpperCase(),
  logo,
  country,
  region,
  game,
  platform,
  ranking: Math.floor(Math.random() * 30) + 1,
  brandColor: color,
});

// Mock Players
const MOCK_PLAYERS: Player[] = [
  // FUT Esports
  { id: 'p1', nickname: 'qRaxs', realName: 'Doğukan Balaban', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Duelist' },
  { id: 'p2', nickname: 'MrFaliN', realName: 'Furkan Yeğen', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Controller' },
  { id: 'p3', nickname: 'yetujey', realName: 'Yunus Emre Kaplan', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=3', role: 'Initiator' },
  { id: 'p4', nickname: 'AtaKaptan', realName: 'Ata Tan', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=4', role: 'Sentinel' },
  { id: 'p5', nickname: 'mojj', realName: 'Muhammed Toprak', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Flex' },
  
  // Fnatic
  { id: 'p6', nickname: 'Derke', realName: 'Nikita Sirmitev', country: 'FI', avatar: 'https://i.pravatar.cc/150?img=6', role: 'Duelist' },
  { id: 'p7', nickname: 'Boaster', realName: 'Jake Howlett', country: 'UK', avatar: 'https://i.pravatar.cc/150?img=7', role: 'Controller' },
  { id: 'p8', nickname: 'Alfajer', realName: 'Emir Ali Beder', country: 'TR', avatar: 'https://i.pravatar.cc/150?img=8', role: 'Sentinel' },
  { id: 'p9', nickname: 'Chronicle', realName: 'Timofey Khromov', country: 'RU', avatar: 'https://i.pravatar.cc/150?img=9', role: 'Initiator' },
  { id: 'p10', nickname: 'Leo', realName: 'Leo Jannesson', country: 'SE', avatar: 'https://i.pravatar.cc/150?img=10', role: 'Flex' },
  
  // NaVi CS2
  { id: 'p11', nickname: 's1mple', realName: 'Oleksandr Kostyliev', country: 'UA', avatar: 'https://i.pravatar.cc/150?img=11', role: 'AWPer' },
  { id: 'p12', nickname: 'electronic', realName: 'Denis Sharipov', country: 'RU', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Rifler' },
  { id: 'p13', nickname: 'Perfecto', realName: 'Ilya Zalutskiy', country: 'RU', avatar: 'https://i.pravatar.cc/150?img=13', role: 'Support' },
  { id: 'p14', nickname: 'b1t', realName: 'Valeriy Vakhovskiy', country: 'UA', avatar: 'https://i.pravatar.cc/150?img=14', role: 'Rifler' },
  { id: 'p15', nickname: 'Aleksib', realName: 'Aleksi Virolainen', country: 'FI', avatar: 'https://i.pravatar.cc/150?img=15', role: 'IGL' },
];

export const MOCK_TEAMS: Team[] = [
  { ...generateMockTeam('FUT Esports', 'valorant', 'vlr', 'https://owcdn.net/img/62bf990f32e06.png', 'TR', 'EMEA', '#d4af37'), players: MOCK_PLAYERS.slice(0, 5) },
  { ...generateMockTeam('Fnatic', 'valorant', 'vlr', 'https://owcdn.net/img/5f73ed26ee8c9.png', 'UK', 'EMEA', '#ff5900'), players: MOCK_PLAYERS.slice(5, 10) },
  generateMockTeam('Sentinels', 'valorant', 'vlr', 'https://owcdn.net/img/605e04c5cd2ec.png', 'US', 'NA', '#000000'),
  generateMockTeam('Cloud9', 'valorant', 'vlr', 'https://owcdn.net/img/5f73ecf41b719.png', 'US', 'NA', '#0f7ac2'),
  generateMockTeam('Team Liquid', 'valorant', 'vlr', 'https://owcdn.net/img/5f73ee3c1b0f2.png', 'US', 'NA', '#0d2249'),
  { ...generateMockTeam('NaVi', 'cs2', 'hltv', 'https://img-cdn.hltv.org/teamlogo/9bgXHC26YCW_plNul8bZY3.png?ixlib=java-2.1.0&w=100&s=f859c8e1e36c531c1a2f86e0de0c8c03', 'UA', 'EU', '#ffcc00'), players: MOCK_PLAYERS.slice(10, 15) },
  generateMockTeam('FaZe Clan', 'cs2', 'hltv', 'https://img-cdn.hltv.org/teamlogo/zLXCVqYUnOjQU6qvghvbYr.svg?ixlib=java-2.1.0&s=c5be74c8bd1e6aad84b29a77ee7e3e4f', 'US', 'NA', '#d62828'),
  generateMockTeam('G2 Esports', 'cs2', 'hltv', 'https://img-cdn.hltv.org/teamlogo/AtzLZSJCHTP_Jw2iDNYXqn.svg?ixlib=java-2.1.0&s=a95dd8fa18c5ce72d9b7ec934f86b33e', 'DE', 'EU', '#003bff'),
  generateMockTeam('Vitality', 'cs2', 'hltv', 'https://img-cdn.hltv.org/teamlogo/QFAV5m0Ys-tRVeg0Yq4vBJ.svg?ixlib=java-2.1.0&s=0a5caec07f006c2157d6fe749d2a5b22', 'FR', 'EU', '#f7b500'),
  generateMockTeam('Astralis', 'cs2', 'hltv', 'https://img-cdn.hltv.org/teamlogo/9bgXHC26YCW_plNul8bZY3.png?ixlib=java-2.1.0&w=100&s=f859c8e1e36c531c1a2f86e0de0c8c03', 'DK', 'EU', '#ed1c24'),
  generateMockTeam('T1', 'lol', 'liquipedia', 'https://am-a.akamaihd.net/image?resize=50:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819606829_t1-2021-worlds.png', 'KR', 'KR', '#e4002b'),
  generateMockTeam('Gen.G', 'lol', 'liquipedia', 'https://am-a.akamaihd.net/image?resize=50:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819050094_GenGLogo20216.png', 'KR', 'KR', '#aa8a00'),
  generateMockTeam('JD Gaming', 'lol', 'liquipedia', 'https://am-a.akamaihd.net/image?resize=50:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FJDG_FullonDark.png', 'CN', 'CN', '#dc143c'),
];

// Generate mock matches
const now = new Date();

export const MOCK_MATCHES: Match[] = [
  // Live Matches
  {
    id: 'match-1',
    platform: 'vlr',
    game: 'valorant',
    status: 'live',
    startTime: new Date(now.getTime() - 45 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[0], // FUT
      score: 1,
    },
    team2: {
      team: MOCK_TEAMS[1], // Fnatic
      score: 1,
    },
    tournament: {
      id: 'vct-emea-1',
      name: 'VCT EMEA League',
      tier: 'S-Tier',
      prizePool: '$150,000',
    },
    format: 'Bo3',
    stream: {
      platform: 'twitch',
      url: 'https://twitch.tv/valorant',
      viewers: 125000,
    },
    maps: [
      { mapName: 'Bind', team1Score: 13, team2Score: 9, isCompleted: true },
      { mapName: 'Haven', team1Score: 8, team2Score: 13, isCompleted: true },
      { mapName: 'Ascent', team1Score: 7, team2Score: 5, isCompleted: false, isCurrent: true },
    ],
    currentMap: {
      mapName: 'Ascent',
      team1: { score: 7, side: 'attack' },
      team2: { score: 5, side: 'defense' },
      half: 'second',
      roundNumber: 13,
    },
  },
  {
    id: 'match-2',
    platform: 'hltv',
    game: 'cs2',
    status: 'live',
    startTime: new Date(now.getTime() - 30 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[5], // NaVi
      score: 0,
    },
    team2: {
      team: MOCK_TEAMS[6], // FaZe
      score: 1,
    },
    tournament: {
      id: 'blast-premier',
      name: 'BLAST Premier World Final',
      tier: 'S-Tier',
      prizePool: '$1,000,000',
    },
    format: 'Bo3',
    stream: {
      platform: 'twitch',
      url: 'https://twitch.tv/blastpremier',
      viewers: 89000,
    },
    maps: [
      { mapName: 'Mirage', team1Score: 11, team2Score: 16, isCompleted: true },
      { mapName: 'Inferno', team1Score: 8, team2Score: 6, isCompleted: false, isCurrent: true },
    ],
    currentMap: {
      mapName: 'Inferno',
      team1: { score: 8, side: 'defense' },
      team2: { score: 6, side: 'attack' },
      half: 'second',
      roundNumber: 15,
    },
  },
  // Upcoming Matches
  {
    id: 'match-3',
    platform: 'vlr',
    game: 'valorant',
    status: 'upcoming',
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[2], // Sentinels
      score: 0,
    },
    team2: {
      team: MOCK_TEAMS[3], // Cloud9
      score: 0,
    },
    tournament: {
      id: 'vct-americas',
      name: 'VCT Americas League',
      tier: 'S-Tier',
    },
    format: 'Bo3',
  },
  {
    id: 'match-4',
    platform: 'vlr',
    game: 'valorant',
    status: 'upcoming',
    startTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[0], // FUT
      score: 0,
    },
    team2: {
      team: MOCK_TEAMS[4], // Team Liquid
      score: 0,
    },
    tournament: {
      id: 'vct-emea-2',
      name: 'VCT EMEA League',
      tier: 'S-Tier',
    },
    format: 'Bo3',
  },
  {
    id: 'match-5',
    platform: 'hltv',
    game: 'cs2',
    status: 'upcoming',
    startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[7], // G2
      score: 0,
    },
    team2: {
      team: MOCK_TEAMS[8], // Vitality
      score: 0,
    },
    tournament: {
      id: 'iem-cologne',
      name: 'IEM Cologne 2026',
      tier: 'S-Tier',
    },
    format: 'Bo5',
  },
  // Completed Matches
  {
    id: 'match-6',
    platform: 'vlr',
    game: 'valorant',
    status: 'completed',
    startTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[0], // FUT
      score: 2,
      isWinner: true,
    },
    team2: {
      team: MOCK_TEAMS[2], // Sentinels
      score: 1,
    },
    tournament: {
      id: 'vct-emea-3',
      name: 'VCT EMEA League',
      tier: 'S-Tier',
    },
    format: 'Bo3',
    maps: [
      { mapName: 'Split', team1Score: 13, team2Score: 11, isCompleted: true },
      { mapName: 'Icebox', team1Score: 9, team2Score: 13, isCompleted: true },
      { mapName: 'Lotus', team1Score: 13, team2Score: 7, isCompleted: true },
    ],
  },
  {
    id: 'match-7',
    platform: 'hltv',
    game: 'cs2',
    status: 'completed',
    startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    team1: {
      team: MOCK_TEAMS[9], // Astralis
      score: 0,
    },
    team2: {
      team: MOCK_TEAMS[5], // NaVi
      score: 2,
      isWinner: true,
    },
    tournament: {
      id: 'blast-premier-2',
      name: 'BLAST Premier World Final',
      tier: 'S-Tier',
    },
    format: 'Bo3',
    maps: [
      { mapName: 'Nuke', team1Score: 10, team2Score: 16, isCompleted: true },
      { mapName: 'Ancient', team1Score: 14, team2Score: 16, isCompleted: true },
    ],
  },
];
