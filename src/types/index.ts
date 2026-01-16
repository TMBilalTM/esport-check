// E-Sports Platform Types

export type GamePlatform = 'vlr' | 'hltv' | 'liquipedia' | 'faceit' | 'esportsearnings';

export type GameType = 'valorant' | 'csgo' | 'cs2' | 'lol' | 'dota2' | 'overwatch' | 'rocketleague';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  followedTeams: FollowedTeam[];
  settings: UserSettings;
}

export interface UserSettings {
  notifications: {
    matchStart: boolean;
    matchEnd: boolean;
    teamUpdates: boolean;
  };
  theme: 'dark' | 'light' | 'system';
  language: string;
}

export interface FollowedTeam {
  id: string;
  teamId: string;
  platform: GamePlatform;
  game: GameType;
  teamName: string;
  teamLogo?: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  country?: string;
  region?: string;
  game: GameType;
  platform: GamePlatform;
  ranking?: number;
  players?: Player[];
  brandColor?: string;
}

export interface Player {
  id: string;
  nickname: string;
  realName?: string;
  country?: string;
  avatar?: string;
  role?: string;
  teamId?: string;
}

export interface Match {
  id: string;
  platform: GamePlatform;
  game: GameType;
  status: MatchStatus;
  startTime: Date;
  endTime?: Date;
  team1: MatchTeam;
  team2: MatchTeam;
  tournament?: Tournament;
  format?: string; // Bo1, Bo3, Bo5
  stream?: StreamInfo;
  maps?: MapResult[];
  currentMap?: CurrentMapInfo;
}

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'postponed' | 'cancelled';

export interface MatchTeam {
  team: Team;
  score: number;
  isWinner?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  tier?: string;
  prizePool?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
}

export interface StreamInfo {
  platform: 'twitch' | 'youtube' | 'other';
  url: string;
  viewers?: number;
  language?: string;
}

export interface MapResult {
  mapName: string;
  team1Score: number;
  team2Score: number;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface CurrentMapInfo {
  mapName: string;
  team1: MapTeamInfo;
  team2: MapTeamInfo;
  half: 'first' | 'second' | 'overtime';
  roundNumber: number;
}

export interface MapTeamInfo {
  score: number;
  side: 'attack' | 'defense' | 'unknown';
  players?: PlayerMatchStats[];
}

export interface PlayerMatchStats {
  player: Player;
  kills: number;
  deaths: number;
  assists: number;
  acs?: number; // Average Combat Score (Valorant)
  adr?: number; // Average Damage per Round (CS)
  rating?: number;
  firstKills?: number;
  firstDeaths?: number;
  clutches?: number;
}

export interface PlatformConfig {
  id: GamePlatform;
  name: string;
  icon: string;
  games: GameType[];
  baseUrl: string;
  color: string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  type: 'match_start' | 'match_end' | 'team_update' | 'score_update';
  title: string;
  message: string;
  matchId?: string;
  teamId?: string;
  read: boolean;
  createdAt: Date;
}
