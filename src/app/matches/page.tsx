'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, LayoutGrid, List, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MatchCard, MatchList } from '@/components/match/match-card';
import { FilterBar, FilterPills } from '@/components/filters/filter-bar';
import { FadeIn } from '@/components/ui/effects';
import { useFilterStore } from '@/store';
import { cn } from '@/lib/utils';
import type { Match, MatchStatus } from '@/types';

type ViewMode = 'grid' | 'list';

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<MatchStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectedPlatforms, selectedGames, showLiveOnly } = useFilterStore();

  // Gerçek verileri çek
  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const response = await fetch('/api/matches');
        if (response.ok) {
          const data = await response.json();
          setMatches(data.map((m: any) => ({
            ...m,
            startTime: new Date(m.startTime),
          })));
        }
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
    // Her 2 dakikada bir yenile
    const interval = setInterval(loadMatches, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Status filter
    if (activeTab !== 'all') {
      filtered = filtered.filter((m) => m.status === activeTab);
    }

    // Live only filter
    if (showLiveOnly) {
      filtered = filtered.filter((m) => m.status === 'live');
    }

    // Platform filter
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((m) => selectedPlatforms.includes(m.platform));
    }

    // Game filter
    if (selectedGames.length > 0) {
      filtered = filtered.filter((m) => selectedGames.includes(m.game));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.team1.team.name.toLowerCase().includes(query) ||
          m.team2.team.name.toLowerCase().includes(query) ||
          m.tournament?.name.toLowerCase().includes(query)
      );
    }

    // Sort: live first, then by start time
    filtered.sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return filtered;
  }, [matches, activeTab, selectedPlatforms, selectedGames, showLiveOnly, searchQuery]);

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const completedCount = matches.filter((m) => m.status === 'completed').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl font-bold">Matches</h1>
                <p className="mt-2 text-muted-foreground">
                  Track live and upcoming esports matches across all platforms
                </p>
              </div>
              <div className="flex items-center gap-3">
                {liveCount > 0 && (
                  <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    {liveCount} Live
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/5">
                  <Clock className="h-3 w-3 mr-1" />
                  {upcomingCount} Upcoming
                </Badge>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams, tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 h-10"
                />
              </div>

              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8',
                    viewMode === 'grid' && 'bg-white/10'
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8',
                    viewMode === 'list' && 'bg-white/10'
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar />

            {/* Active Filter Pills */}
            <FilterPills />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MatchStatus | 'all')}>
          <TabsList className="bg-white/5 p-1 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              All Matches
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-white/10">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live ({liveCount})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/10">
              Upcoming ({upcomingCount})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white/10">
              Completed ({completedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <FadeIn key={match.id} delay={index * 0.05}>
                    <MatchCard match={match} />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <MatchList matches={filteredMatches} variant="compact" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
