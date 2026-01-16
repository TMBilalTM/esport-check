'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamGrid } from '@/components/team/team-card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { GameType, GamePlatform, Team } from '@/types';
import { PLATFORMS, GAMES } from '@/lib/data';

interface TeamsClientProps {
  initialTeams: Team[];
}

export function TeamsClient({ initialTeams }: TeamsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for search to avoid input lag/focus loss
  const [searchQuery, setSearchQuery] = useState('');

  // URL state for filters
  const selectedGame = (searchParams.get('game') as GameType | 'all') || 'all';
  const selectedPlatform = (searchParams.get('platform') as GamePlatform | 'all') || 'all';
  const selectedRegion = searchParams.get('region') || 'all';

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === 'all' || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleGameChange = (game: GameType | 'all') => {
    pushParams({
      game,
      region: game === 'valorant' ? selectedRegion : 'all',
    });
  };

  const handlePlatformChange = (platform: GamePlatform | 'all') => {
    pushParams({ platform });
  };

  const handleRegionChange = (region: string) => {
    pushParams({ region });
  };

  const filteredTeams = useMemo(() => {
    let teams = [...initialTeams];

    // Game filter
    if (selectedGame !== 'all') {
      teams = teams.filter((t) => t.game === selectedGame);
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      teams = teams.filter((t) => t.platform === selectedPlatform);
    }

    // Region filter (Valorant only)
    if (selectedGame === 'valorant' && selectedRegion !== 'all') {
      teams = teams.filter((t) => (t.region || t.country) === selectedRegion);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      teams = teams.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.shortName?.toLowerCase().includes(query) ||
          t.region?.toLowerCase().includes(query)
      );
    }

    // Sort by ranking
    teams.sort((a, b) => (a.ranking ?? 999) - (b.ranking ?? 999));

    return teams;
  }, [selectedGame, selectedPlatform, selectedRegion, searchQuery, initialTeams]);

  const valorantRegions = useMemo(() => {
    const regionSet = new Set<string>();
    initialTeams.forEach((team) => {
      if (team.game !== 'valorant') return;
      const region = team.region || team.country;
      if (region) regionSet.add(region);
    });
    return Array.from(regionSet).sort((a, b) => a.localeCompare(b));
  }, [initialTeams]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h1 className="text-2xl font-bold font-display">Teams</h1>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams..."
                    className="pl-9 h-9 bg-background/50 border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <Button
                variant={selectedGame === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-8 rounded-full"
                onClick={() => handleGameChange('all')}
              >
                All Games
              </Button>
              {GAMES.map((game) => (
                <Button
                  key={game.id}
                  variant={selectedGame === game.id ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "h-8 rounded-full border-white/10",
                    selectedGame === game.id && "border-transparent"
                  )}
                  style={selectedGame === game.id ? { backgroundColor: game.color } : undefined}
                  onClick={() => handleGameChange(game.id as GameType)}
                >
                  {game.name}
                </Button>
              ))}
              <div className="w-px h-6 bg-white/10 mx-2" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-white/10"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="border-white/10">
                  <SheetHeader className="pb-0">
                    <SheetTitle className="text-lg">Filters</SheetTitle>
                    <SheetDescription>
                      Refine the teams list with platform and region.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="px-4 pb-4 space-y-6">
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Platform
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedPlatform === 'all' ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 rounded-full"
                          onClick={() => handlePlatformChange('all')}
                        >
                          All Platforms
                        </Button>
                        {PLATFORMS.map((platform) => (
                          <Button
                            key={platform.id}
                            variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 rounded-full border-white/10"
                            onClick={() => handlePlatformChange(platform.id as GamePlatform)}
                          >
                            {platform.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Region (Valorant)
                      </div>
                      <div className={cn('flex flex-wrap gap-2', selectedGame !== 'valorant' && 'opacity-50 pointer-events-none')}>
                        <Button
                          variant={selectedRegion === 'all' ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 rounded-full"
                          onClick={() => handleRegionChange('all')}
                        >
                          All Regions
                        </Button>
                        {valorantRegions.map((region) => (
                          <Button
                            key={region}
                            variant={selectedRegion === region ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 rounded-full border-white/10"
                            onClick={() => handleRegionChange(region)}
                          >
                            {region}
                          </Button>
                        ))}
                      </div>
                      {selectedGame !== 'valorant' && (
                        <p className="text-xs text-muted-foreground">
                          Select VALORANT to filter by region.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => pushParams({ platform: 'all', region: 'all' })}
                      >
                        Reset filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {filteredTeams.length > 0 ? (
          <TeamGrid teams={filteredTeams} />
        ) : (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No teams found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
