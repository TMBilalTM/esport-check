'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountdownTimer, MatchTimer } from '@/components/ui/countdown';
import { FadeIn, LiveIndicator } from '@/components/ui/effects';
import { useFollowStore, useAuthStore } from '@/store';
import { PLATFORMS, GAMES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Match } from '@/types';

interface MatchDetailClientProps {
  match: Match;
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  const { isAuthenticated } = useAuthStore();
  const { isFollowing, addTeam, removeTeam } = useFollowStore();

  const platform = PLATFORMS.find((p) => p.id === match.platform);
  const game = GAMES.find((g) => g.id === match.game);
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isCompleted = match.status === 'completed';

  const handleFollow = (teamId: string, teamName: string, teamLogo?: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to follow teams');
      return;
    }

    if (isFollowing(teamId, match.platform)) {
      removeTeam(teamId);
      toast.success(`Unfollowed ${teamName}`);
    } else {
      addTeam({
        teamId,
        platform: match.platform,
        game: match.game,
        teamName,
        teamLogo,
      });
      toast.success(`Following ${teamName}`);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${match.team1.team.name} vs ${match.team2.team.name}`,
        text: `Watch ${match.team1.team.name} vs ${match.team2.team.name} - ${match.tournament?.name}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn>
            {/* Back Button & Meta */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/matches">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Matches
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-white/10" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {isLive && match.stream && (
                  <a href={match.stream.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Watch Live
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Tournament Info */}
            {match.tournament && (
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="bg-white/5">{match.tournament.name}</Badge>
                {match.format && (
                  <Badge variant="outline" className="border-white/10">{match.format}</Badge>
                )}
                {game && (
                  <Badge
                    variant="outline"
                    className="border-white/10"
                    style={{ borderColor: `${game.color}50` }}
                  >
                    {game.name}
                  </Badge>
                )}
              </div>
            )}

            {/* Match Header */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
              {/* Team 1 */}
              <div className="flex-1 flex items-center gap-6">
                <Avatar className="h-24 w-24 lg:h-32 lg:w-32 rounded-2xl bg-white/5">
                  <AvatarImage src={match.team1.team.logo} />
                  <AvatarFallback className="text-2xl lg:text-3xl rounded-2xl">
                    {match.team1.team.shortName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold">
                      {match.team1.team.name}
                    </h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8',
                        isFollowing(match.team1.team.id, match.platform)
                          ? 'text-yellow-500'
                          : 'text-muted-foreground'
                      )}
                      onClick={() =>
                        handleFollow(
                          match.team1.team.id,
                          match.team1.team.name,
                          match.team1.team.logo
                        )
                      }
                    >
                      <Star
                        className={cn(
                          'h-4 w-4',
                          isFollowing(match.team1.team.id, match.platform) && 'fill-current'
                        )}
                      />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    #{match.team1.team.ranking} World Ranking
                  </p>
                </div>
              </div>

              {/* Score / VS */}
              <div className="shrink-0 text-center">
                {isLive && <LiveIndicator className="justify-center mb-3" />}
                {isUpcoming && (
                  <div className="mb-3">
                    <CountdownTimer targetDate={match.startTime} />
                  </div>
                )}
                {(isLive || isCompleted) ? (
                  <div className="flex items-center gap-4 lg:gap-6">
                    <span
                      className={cn(
                        'font-display text-5xl lg:text-7xl font-bold tabular-nums',
                        isCompleted && match.team1.isWinner && 'text-green-500'
                      )}
                    >
                      {match.team1.score}
                    </span>
                    <span className="text-3xl lg:text-4xl text-muted-foreground/50">:</span>
                    <span
                      className={cn(
                        'font-display text-5xl lg:text-7xl font-bold tabular-nums',
                        isCompleted && match.team2.isWinner && 'text-green-500'
                      )}
                    >
                      {match.team2.score}
                    </span>
                  </div>
                ) : (
                  <span className="font-display text-4xl text-muted-foreground/50">VS</span>
                )}
                {isLive && (
                  <MatchTimer startTime={match.startTime} className="justify-center mt-3" />
                )}
                {isCompleted && (
                  <p className="text-sm text-muted-foreground mt-3">Match Completed</p>
                )}
              </div>

              {/* Team 2 */}
              <div className="flex-1 flex items-center gap-6 lg:flex-row-reverse lg:text-right">
                <Avatar className="h-24 w-24 lg:h-32 lg:w-32 rounded-2xl bg-white/5">
                  <AvatarImage src={match.team2.team.logo} />
                  <AvatarFallback className="text-2xl lg:text-3xl rounded-2xl">
                    {match.team2.team.shortName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 lg:flex-row-reverse">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold">
                      {match.team2.team.name}
                    </h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8',
                        isFollowing(match.team2.team.id, match.platform)
                          ? 'text-yellow-500'
                          : 'text-muted-foreground'
                      )}
                      onClick={() =>
                        handleFollow(
                          match.team2.team.id,
                          match.team2.team.name,
                          match.team2.team.logo
                        )
                      }
                    >
                      <Star
                        className={cn(
                          'h-4 w-4',
                          isFollowing(match.team2.team.id, match.platform) && 'fill-current'
                        )}
                      />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    #{match.team2.team.ranking} World Ranking
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="maps">
              <TabsList className="bg-white/5 p-1 mb-6">
                <TabsTrigger value="maps" className="data-[state=active]:bg-white/10">
                  Maps
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-white/10">
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="lineups" className="data-[state=active]:bg-white/10">
                  Lineups
                </TabsTrigger>
              </TabsList>

              <TabsContent value="maps">
                {match.maps && match.maps.length > 0 ? (
                  <div className="space-y-4">
                    {match.maps.map((map, index) => (
                      <Card
                        key={index}
                        className={cn(
                          'border-white/5 bg-card/50',
                          map.isCurrent && 'border-white/20 bg-card/80'
                        )}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">Map {index + 1}</span>
                              <h3 className="font-semibold text-lg">{map.mapName}</h3>
                              {map.isCurrent && (
                                <Badge variant="outline" className="border-white/20">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-6">
                              <span className={cn('text-2xl font-bold font-display', map.score1 > map.score2 ? 'text-green-500' : 'text-foreground')}>
                                {map.score1}
                              </span>
                              <span className="text-muted-foreground">:</span>
                              <span className={cn('text-2xl font-bold font-display', map.score2 > map.score1 ? 'text-green-500' : 'text-foreground')}>
                                {map.score2}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <p className="text-muted-foreground">Map information not available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats">
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <p className="text-muted-foreground">Detailed statistics coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="lineups">
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <p className="text-muted-foreground">Team lineups coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-white/5 bg-card/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Match Info</h3>
                <div className="space-y-4 text-sm">
                  {match.tournament && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tournament</span>
                      <span className="font-medium text-right">{match.tournament.name}</span>
                    </div>
                  )}
                  {match.format && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium text-right">{match.format}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-right">
                      {match.startTime?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-right">
                      {match.startTime?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
