'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Eye, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CountdownTimer, MatchTimer } from '@/components/ui/countdown';
import { LiveIndicator, FadeIn } from '@/components/ui/effects';
import { cn } from '@/lib/utils';
import type { Match } from '@/types';
import { PLATFORMS, GAMES } from '@/lib/data';

interface MatchCardProps {
  match: Match;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function MatchCard({ match, variant = 'default', className }: MatchCardProps) {
  const platform = PLATFORMS.find((p) => p.id === match.platform);
  const game = GAMES.find((g) => g.id === match.game);
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isCompleted = match.status === 'completed';

  if (variant === 'compact') {
    return (
      <Link href={`/match/${match.id}`}>
        <Card className="group relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-white/10">
          {/* Game color accent */}
          {game && (
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: game.color }}
            />
          )}
          
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Teams */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 rounded-lg bg-white/5 border" style={{ borderColor: match.team1.team.brandColor ? `${match.team1.team.brandColor}40` : 'transparent' }}>
                    <AvatarImage src={match.team1.team.logo} className="object-contain p-1" />
                    <AvatarFallback className="text-xs rounded-lg font-semibold" style={{ backgroundColor: `${match.team1.team.brandColor}20`, color: match.team1.team.brandColor }}>
                      {match.team1.team.shortName}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{match.team1.team.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isLive && (
                    <>
                      <span className="text-lg font-bold tabular-nums">{match.team1.score}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-lg font-bold tabular-nums">{match.team2.score}</span>
                    </>
                  )}
                  {isCompleted && (
                    <>
                      <span
                        className={cn(
                          'text-lg font-bold tabular-nums',
                          match.team1.isWinner && 'text-green-500'
                        )}
                      >
                        {match.team1.score}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span
                        className={cn(
                          'text-lg font-bold tabular-nums',
                          match.team2.isWinner && 'text-green-500'
                        )}
                      >
                        {match.team2.score}
                      </span>
                    </>
                  )}
                  {isUpcoming && (
                    <span className="text-sm text-muted-foreground">vs</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-sm font-medium truncate text-right">
                    {match.team2.team.name}
                  </span>
                  <Avatar className="h-10 w-10 rounded-lg bg-white/5 border" style={{ borderColor: match.team2.team.brandColor ? `${match.team2.team.brandColor}40` : 'transparent' }}>
                    <AvatarImage src={match.team2.team.logo} className="object-contain p-1" />
                    <AvatarFallback className="text-xs rounded-lg font-semibold" style={{ backgroundColor: `${match.team2.team.brandColor}20`, color: match.team2.team.brandColor }}>
                      {match.team2.team.shortName}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Status */}
              <div className="shrink-0">
                {isLive && <LiveIndicator size="sm" />}
                {isUpcoming && (
                  <CountdownTimer targetDate={match.startTime} compact className="text-xs" />
                )}
                {isCompleted && (
                  <span className="text-xs text-muted-foreground">Completed</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/match/${match.id}`}>
        <Card className="group relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm transition-all hover:border-white/10">
          {/* Live indicator bar or game color */}
          {isLive ? (
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          ) : game && (
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: game.color }} />
          )}

          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {game && (
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${game.color}20` }}
                  >
                    <img src={game.icon} alt={game.name} className="h-4 w-4 object-contain" />
                  </div>
                )}
                {match.tournament && (
                  <Badge variant="secondary" className="bg-white/5 text-xs font-normal">
                    {match.tournament.name}
                  </Badge>
                )}
                {match.format && (
                  <Badge variant="outline" className="border-white/10 text-xs font-normal">
                    {match.format}
                  </Badge>
                )}
              </div>
              {isLive && <LiveIndicator />}
              {isUpcoming && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <CountdownTimer targetDate={match.startTime} compact />
                </div>
              )}
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between gap-8">
              {/* Team 1 */}
              <div className="flex-1 text-center">
                <Avatar className="h-20 w-20 mx-auto rounded-xl bg-white/5 mb-3 border-2" style={{ borderColor: match.team1.team.brandColor ? `${match.team1.team.brandColor}40` : 'transparent' }}>
                  <AvatarImage src={match.team1.team.logo} className="object-contain p-2" />
                  <AvatarFallback className="text-xl rounded-xl" style={{ backgroundColor: `${match.team1.team.brandColor}20`, color: match.team1.team.brandColor }}>
                    {match.team1.team.shortName}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{match.team1.team.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  #{match.team1.team.ranking} World
                </p>
              </div>

              {/* Score */}
              <div className="shrink-0 text-center">
                {(isLive || isCompleted) && (
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'text-4xl font-bold tabular-nums',
                        isCompleted && match.team1.isWinner && 'text-green-500'
                      )}
                    >
                      {match.team1.score}
                    </span>
                    <span className="text-2xl text-muted-foreground/50">:</span>
                    <span
                      className={cn(
                        'text-4xl font-bold tabular-nums',
                        isCompleted && match.team2.isWinner && 'text-green-500'
                      )}
                    >
                      {match.team2.score}
                    </span>
                  </div>
                )}
                {isUpcoming && (
                  <span className="text-2xl text-muted-foreground/50">VS</span>
                )}
                {isLive && match.currentMap && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{match.currentMap.mapName}</span>
                    <span className="mx-2">·</span>
                    <span>
                      {match.currentMap.team1.score} - {match.currentMap.team2.score}
                    </span>
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div className="flex-1 text-center">
                <Avatar className="h-20 w-20 mx-auto rounded-xl bg-white/5 mb-3 border-2" style={{ borderColor: match.team2.team.brandColor ? `${match.team2.team.brandColor}40` : 'transparent' }}>
                  <AvatarImage src={match.team2.team.logo} className="object-contain p-2" />
                  <AvatarFallback className="text-xl rounded-xl" style={{ backgroundColor: `${match.team2.team.brandColor}20`, color: match.team2.team.brandColor }}>
                    {match.team2.team.shortName}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{match.team2.team.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  #{match.team2.team.ranking} World
                </p>
              </div>
            </div>

            {/* Maps */}
            {match.maps && match.maps.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {match.maps.map((map, index) => (
                  <div
                    key={index}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium',
                      map.isCurrent
                        ? 'bg-white/10 text-foreground'
                        : map.isCompleted
                        ? 'bg-white/5 text-muted-foreground'
                        : 'bg-transparent text-muted-foreground/50'
                    )}
                  >
                    {map.mapName}
                    {map.isCompleted && (
                      <span className="ml-1.5 text-[10px]">
                        {map.team1Score}-{map.team2Score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Stream info */}
            {isLive && match.stream && (
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{match.stream.viewers?.toLocaleString()} watching</span>
                </div>
                <a
                  href={match.stream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Watch live
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/match/${match.id}`}>
      <Card className="group relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-white/10 card-hover">
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500" />
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {match.tournament && (
                <Badge variant="secondary" className="bg-white/5 text-xs font-normal">
                  {match.tournament.name}
                </Badge>
              )}
              {match.format && (
                <span className="text-xs text-muted-foreground">{match.format}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {game && (
                <Badge variant="outline" className="border-white/10 text-xs">
                  {game.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            {/* Team 1 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 rounded-lg bg-white/5 shrink-0">
                <AvatarImage src={match.team1.team.logo} />
                <AvatarFallback className="text-sm rounded-lg">
                  {match.team1.team.shortName}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{match.team1.team.name}</p>
                <p className="text-xs text-muted-foreground">
                  #{match.team1.team.ranking}
                </p>
              </div>
            </div>

            {/* Score/Status */}
            <div className="shrink-0 text-center min-w-[80px]">
              {(isLive || isCompleted) && (
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={cn(
                      'text-2xl font-bold tabular-nums',
                      isCompleted && match.team1.isWinner && 'text-green-500'
                    )}
                  >
                    {match.team1.score}
                  </span>
                  <span className="text-muted-foreground/50">-</span>
                  <span
                    className={cn(
                      'text-2xl font-bold tabular-nums',
                      isCompleted && match.team2.isWinner && 'text-green-500'
                    )}
                  >
                    {match.team2.score}
                  </span>
                </div>
              )}
              {isUpcoming && (
                <span className="text-lg text-muted-foreground/50">VS</span>
              )}
              {isLive && <LiveIndicator size="sm" className="justify-center mt-1" />}
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
              <div className="min-w-0 text-right">
                <p className="font-medium truncate">{match.team2.team.name}</p>
                <p className="text-xs text-muted-foreground">
                  #{match.team2.team.ranking}
                </p>
              </div>
              <Avatar className="h-12 w-12 rounded-lg bg-white/5 shrink-0">
                <AvatarImage src={match.team2.team.logo} />
                <AvatarFallback className="text-sm rounded-lg">
                  {match.team2.team.shortName}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            {isUpcoming && (
              <CountdownTimer targetDate={match.startTime} compact />
            )}
            {isLive && match.currentMap && (
              <span>
                Map {match.maps?.findIndex((m) => m.isCurrent) ?? 0 + 1}:{' '}
                <span className="text-foreground">{match.currentMap.mapName}</span>
              </span>
            )}
            {isCompleted && (
              <span>Completed</span>
            )}
            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface MatchListProps {
  matches: Match[];
  variant?: 'default' | 'compact';
  className?: string;
}

export function MatchList({ matches, variant = 'default', className }: MatchListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {matches.map((match, index) => (
        <FadeIn key={match.id} delay={index * 0.05}>
          <MatchCard match={match} variant={variant} />
        </FadeIn>
      ))}
    </div>
  );
}
