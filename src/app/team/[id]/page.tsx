'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchCard } from '@/components/match/match-card';
import { FadeIn, LiveIndicator } from '@/components/ui/effects';
import { useFollowStore, useAuthStore } from '@/store';
import { MOCK_TEAMS, MOCK_MATCHES, PLATFORMS, GAMES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { notFound } from 'next/navigation';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const team = MOCK_TEAMS.find((t) => t.id === resolvedParams.id);
  const { isAuthenticated } = useAuthStore();
  const { isFollowing, addTeam, removeTeam } = useFollowStore();

  if (!team) {
    notFound();
  }

  const platform = PLATFORMS.find((p) => p.id === team.platform);
  const game = GAMES.find((g) => g.id === team.game);
  const following = isFollowing(team.id, team.platform);

  const teamMatches = useMemo(() => {
    return MOCK_MATCHES.filter(
      (m) => m.team1.team.id === team.id || m.team2.team.id === team.id
    ).sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [team.id]);

  const liveMatches = teamMatches.filter((m) => m.status === 'live');
  const upcomingMatches = teamMatches.filter((m) => m.status === 'upcoming');
  const completedMatches = teamMatches.filter((m) => m.status === 'completed');

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to follow teams');
      return;
    }

    if (following) {
      removeTeam(team.id);
      toast.success(`Unfollowed ${team.name}`);
    } else {
      addTeam({
        teamId: team.id,
        platform: team.platform,
        game: team.game,
        teamName: team.name,
        teamLogo: team.logo,
      });
      toast.success(`Following ${team.name}`);
    }
  };

  // Mock stats
  const stats = {
    wins: 24,
    losses: 8,
    winRate: '75%',
    recentForm: ['W', 'W', 'L', 'W', 'W'],
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn>
            {/* Back Button */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/teams">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Teams
                </Button>
              </Link>
              {liveMatches.length > 0 && (
                <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live Now
                </Badge>
              )}
            </div>

            {/* Team Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-28 w-28 rounded-2xl bg-white/5 border-4" style={{ borderColor: team.brandColor || 'transparent' }}>
                  <AvatarImage src={team.logo} className="object-contain p-3" />
                  <AvatarFallback className="text-3xl rounded-2xl font-bold" style={{ backgroundColor: `${team.brandColor}20`, color: team.brandColor }}>
                    {team.shortName || team.name.substring(0, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {game && (
                  <div
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl border-4 border-background flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${game.color}20` }}
                  >
                    <img src={game.icon} alt={game.name} className="h-6 w-6 object-contain" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl md:text-4xl font-bold">{team.name}</h1>
                  {team.shortName && (
                    <Badge variant="outline" className="border-white/10 text-muted-foreground">
                      {team.shortName}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {team.region && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4" />
                      {team.region}
                    </span>
                  )}
                  {team.ranking && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      #{team.ranking} World Ranking
                    </span>
                  )}
                  {game && (
                    <Badge
                      variant="secondary"
                      className="bg-white/5"
                      style={{ color: game.color }}
                    >
                      {game.name}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={following ? 'default' : 'outline'}
                  className={cn(
                    !following && 'border-white/10',
                    following && 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  )}
                  onClick={handleFollow}
                >
                  <Star className={cn('h-4 w-4 mr-2', following && 'fill-current')} />
                  {following ? 'Following' : 'Follow'}
                </Button>
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
            <Tabs defaultValue="matches">
              <TabsList className="bg-white/5 p-1 mb-6">
                <TabsTrigger value="matches" className="data-[state=active]:bg-white/10">
                  Matches
                </TabsTrigger>
                <TabsTrigger value="roster" className="data-[state=active]:bg-white/10">
                  Roster
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-white/10">
                  Statistics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="space-y-8">
                {/* Live Matches */}
                {liveMatches.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <LiveIndicator />
                      <h2 className="font-semibold">Live Now</h2>
                    </div>
                    <div className="space-y-4">
                      {liveMatches.map((match) => (
                        <MatchCard key={match.id} match={match} variant="featured" />
                      ))}
                    </div>
                  </section>
                )}

                {/* Upcoming Matches */}
                {upcomingMatches.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <h2 className="font-semibold">Upcoming</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {upcomingMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Recent Matches */}
                {completedMatches.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <h2 className="font-semibold">Recent Results</h2>
                    </div>
                    <div className="space-y-3">
                      {completedMatches.map((match) => (
                        <MatchCard key={match.id} match={match} variant="compact" />
                      ))}
                    </div>
                  </section>
                )}

                {teamMatches.length === 0 && (
                  <div className="text-center py-16">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No matches scheduled</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="roster">
                {team.players && team.players.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {team.players.map((player) => (
                      <Card key={player.id} className="border-white/5 bg-card/50 hover:bg-card/80 transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 rounded-xl border-2" style={{ borderColor: `${team.brandColor}40` }}>
                              <AvatarImage src={player.avatar} className="object-cover" />
                              <AvatarFallback className="text-lg rounded-xl font-semibold" style={{ backgroundColor: `${team.brandColor}20`, color: team.brandColor }}>
                                {player.nickname.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{player.nickname}</h3>
                              {player.realName && (
                                <p className="text-sm text-muted-foreground">{player.realName}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                {player.role && (
                                  <Badge variant="secondary" className="bg-white/5 text-xs">
                                    {player.role}
                                  </Badge>
                                )}
                                {player.country && (
                                  <span className="text-xs text-muted-foreground">{player.country}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-white/5 bg-card/50">
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Roster information coming soon</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="stats">
                <Card className="border-white/5 bg-card/50">
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed statistics coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Season Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
                    <p className="text-xs text-muted-foreground">Losses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.winRate}</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recent Form</p>
                  <div className="flex items-center gap-1">
                    {stats.recentForm.map((result, index) => (
                      <div
                        key={index}
                        className={cn(
                          'h-8 w-8 rounded flex items-center justify-center text-xs font-bold',
                          result === 'W'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        )}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Team Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <span className="text-sm font-medium">{team.region || 'Unknown'}</span>
                </div>
                <Separator className="bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Game</span>
                  <Badge variant="secondary" className="bg-white/5">
                    {game?.name || 'Unknown'}
                  </Badge>
                </div>
                <Separator className="bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <Badge variant="outline" className="border-white/10">
                    {platform?.name || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* External Links */}
            <Card className="border-white/5 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">External Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {platform && (
                    <a
                      href={platform.baseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium">{platform.name}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
