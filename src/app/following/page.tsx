'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MatchCard } from '@/components/match/match-card';
import { FadeIn, LiveIndicator } from '@/components/ui/effects';
import { useFollowStore, useAuthStore } from '@/store';
import { MOCK_MATCHES, MOCK_TEAMS, GAMES } from '@/lib/data';

export default function FollowingPage() {
  const { isAuthenticated } = useAuthStore();
  const { followedTeams, removeTeam } = useFollowStore();

  const followedTeamMatches = useMemo(() => {
    const teamIds = followedTeams.map((ft) => ft.teamId);
    return MOCK_MATCHES.filter(
      (m) =>
        teamIds.includes(m.team1.team.id) || teamIds.includes(m.team2.team.id)
    ).sort((a, b) => {
      // Live matches first
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      // Then upcoming
      if (a.status === 'upcoming' && b.status === 'completed') return -1;
      if (b.status === 'upcoming' && a.status === 'completed') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [followedTeams]);

  const liveMatches = followedTeamMatches.filter((m) => m.status === 'live');
  const upcomingMatches = followedTeamMatches.filter((m) => m.status === 'upcoming');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Star className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Sign in to follow teams</h1>
          <p className="text-muted-foreground mb-8">
            Create an account to follow your favorite teams and never miss a match.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (followedTeams.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#0a0a0c]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <FadeIn>
              <h1 className="font-display text-4xl font-bold">Following</h1>
              <p className="mt-2 text-muted-foreground">
                Track matches from teams you follow
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Empty State */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">
              You're not following any teams yet
            </h2>
            <p className="text-muted-foreground mb-8">
              Start following teams to see their matches and get notifications.
            </p>
            <Link href="/teams">
              <Button>Browse Teams</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl font-bold">Following</h1>
                <p className="mt-2 text-muted-foreground">
                  Track matches from teams you follow
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/5">
                  <Star className="h-3 w-3 mr-1" />
                  {followedTeams.length} Teams
                </Badge>
                {liveMatches.length > 0 && (
                  <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    {liveMatches.length} Live
                  </Badge>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Matches */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <LiveIndicator />
                  <h2 className="font-semibold">Live Now</h2>
                </div>
                <div className="space-y-4">
                  {liveMatches.map((match, index) => (
                    <FadeIn key={match.id} delay={index * 0.1}>
                      <MatchCard match={match} variant="featured" />
                    </FadeIn>
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
                  {upcomingMatches.map((match, index) => (
                    <FadeIn key={match.id} delay={index * 0.1}>
                      <MatchCard match={match} />
                    </FadeIn>
                  ))}
                </div>
              </section>
            )}

            {followedTeamMatches.length === 0 && (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No upcoming matches</h3>
                <p className="text-muted-foreground">
                  Your followed teams don't have any scheduled matches right now
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Followed Teams */}
          <div className="lg:col-span-1">
            <Card className="border-white/5 bg-card/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Followed Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {followedTeams.map((ft) => {
                    const team = MOCK_TEAMS.find((t) => t.id === ft.teamId);
                    const game = GAMES.find((g) => g.id === ft.game);
                    const hasLiveMatch = liveMatches.some(
                      (m) =>
                        m.team1.team.id === ft.teamId || m.team2.team.id === ft.teamId
                    );

                    return (
                      <div
                        key={ft.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <Avatar className="h-10 w-10 rounded-lg bg-white/5">
                          <AvatarImage src={ft.teamLogo} />
                          <AvatarFallback className="rounded-lg text-xs">
                            {ft.teamName.substring(0, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{ft.teamName}</p>
                            {hasLiveMatch && (
                              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{game?.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          onClick={() => removeTeam(ft.teamId)}
                        >
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <Link href="/teams" className="block mt-4">
                  <Button variant="outline" className="w-full border-white/10">
                    Find More Teams
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
