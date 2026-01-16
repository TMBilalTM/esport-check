'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/effects';
import { GAMES } from '@/lib/data';

// Mock tournaments
const MOCK_TOURNAMENTS = [
  {
    id: '1',
    name: 'VCT EMEA League 2026',
    game: 'valorant',
    tier: 'S-Tier',
    prizePool: '$150,000',
    startDate: '2026-01-10',
    endDate: '2026-03-15',
    status: 'ongoing',
    teams: 12,
    location: 'Berlin, Germany',
  },
  {
    id: '2',
    name: 'BLAST Premier World Final',
    game: 'cs2',
    tier: 'S-Tier',
    prizePool: '$1,000,000',
    startDate: '2026-01-12',
    endDate: '2026-01-20',
    status: 'ongoing',
    teams: 8,
    location: 'Abu Dhabi, UAE',
  },
  {
    id: '3',
    name: 'IEM Cologne 2026',
    game: 'cs2',
    tier: 'S-Tier',
    prizePool: '$1,250,000',
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    status: 'upcoming',
    teams: 24,
    location: 'Cologne, Germany',
  },
  {
    id: '4',
    name: 'VCT Americas League 2026',
    game: 'valorant',
    tier: 'S-Tier',
    prizePool: '$150,000',
    startDate: '2026-01-15',
    endDate: '2026-03-20',
    status: 'upcoming',
    teams: 10,
    location: 'Los Angeles, USA',
  },
  {
    id: '5',
    name: 'LCK Spring 2026',
    game: 'lol',
    tier: 'S-Tier',
    prizePool: '$500,000',
    startDate: '2026-01-20',
    endDate: '2026-04-10',
    status: 'upcoming',
    teams: 10,
    location: 'Seoul, South Korea',
  },
  {
    id: '6',
    name: 'The International 2026',
    game: 'dota2',
    tier: 'S-Tier',
    prizePool: '$40,000,000',
    startDate: '2026-08-15',
    endDate: '2026-08-30',
    status: 'upcoming',
    teams: 20,
    location: 'TBD',
  },
];

export default function TournamentsPage() {
  const ongoingTournaments = MOCK_TOURNAMENTS.filter((t) => t.status === 'ongoing');
  const upcomingTournaments = MOCK_TOURNAMENTS.filter((t) => t.status === 'upcoming');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl font-bold">Tournaments</h1>
                <p className="mt-2 text-muted-foreground">
                  Explore ongoing and upcoming esports tournaments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/5">
                  <Trophy className="h-3 w-3 mr-1" />
                  {MOCK_TOURNAMENTS.length} Tournaments
                </Badge>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Ongoing Tournaments */}
        {ongoingTournaments.length > 0 && (
          <section className="mb-12">
            <FadeIn>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className="font-semibold text-lg">Ongoing</h2>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {ongoingTournaments.map((tournament) => {
                const game = GAMES.find((g) => g.id === tournament.game);
                return (
                  <StaggerItem key={tournament.id}>
                    <Card className="group border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-white/10 transition-all card-hover overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge variant="secondary" className="bg-white/5 mb-3">
                              {tournament.tier}
                            </Badge>
                            <h3 className="font-semibold text-lg">{tournament.name}</h3>
                          </div>
                          {game && (
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold"
                              style={{ backgroundColor: `${game.color}20`, color: game.color }}
                            >
                              {game.name[0]}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
                            <p className="font-semibold">{tournament.prizePool}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Teams</p>
                            <p className="font-semibold">{tournament.teams}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{tournament.location}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        )}

        {/* Upcoming Tournaments */}
        <section>
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-lg">Upcoming</h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map((tournament) => {
              const game = GAMES.find((g) => g.id === tournament.game);
              return (
                <StaggerItem key={tournament.id}>
                  <Card className="group border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-white/10 transition-all card-hover h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline" className="border-white/10">
                          {tournament.tier}
                        </Badge>
                        {game && (
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${game.color}20`, color: game.color }}
                          >
                            {game.name[0]}
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold mb-4">{tournament.name}</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Prize Pool</span>
                          <span className="font-medium">{tournament.prizePool}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Teams</span>
                          <span className="font-medium">{tournament.teams}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Starts</span>
                          <span className="font-medium">{tournament.startDate}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{tournament.location}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      </div>
    </div>
  );
}
