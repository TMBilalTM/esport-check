'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useFilterStore } from '@/store';
import { PLATFORMS, GAMES } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { GamePlatform, GameType } from '@/types';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  color?: string;
  icon?: string;
}

function FilterChip({ label, isSelected, onClick, color, icon }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        isSelected
          ? 'bg-white text-black'
          : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
      )}
    >
      {icon && (
        <div className="h-4 w-4 flex items-center justify-center overflow-hidden">
          <img src={icon} alt={label} className="h-full w-full object-contain" />
        </div>
      )}
      {isSelected && <Check className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

export function FilterBar({ className }: { className?: string }) {
  const {
    selectedPlatforms,
    selectedGames,
    showLiveOnly,
    togglePlatform,
    toggleGame,
    setShowLiveOnly,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters =
    selectedPlatforms.length > 0 || selectedGames.length > 0 || showLiveOnly;

  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {/* Live Only Toggle */}
      <button
        onClick={() => setShowLiveOnly(!showLiveOnly)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          showLiveOnly
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent'
        )}
      >
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            showLiveOnly ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'
          )}
        />
        Live Only
      </button>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Platform Chips - Show selected or first 3 */}
      <div className="flex items-center gap-2">
        {PLATFORMS.slice(0, 4).map((platform) => (
          <FilterChip
            key={platform.id}
            label={platform.name}
            isSelected={selectedPlatforms.includes(platform.id)}
            onClick={() => togglePlatform(platform.id)}
            icon={platform.icon}
            color={platform.color}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Game Chips - Show first 4 */}
      <div className="flex items-center gap-2">
        {GAMES.slice(0, 4).map((game) => (
          <FilterChip
            key={game.id}
            label={game.name}
            isSelected={selectedGames.includes(game.id)}
            onClick={() => toggleGame(game.id)}
            icon={game.icon}
            color={game.color}
          />
        ))}
      </div>

      {/* More Filters / Reset */}
      <div className="flex items-center gap-2 ml-auto">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        )}
        <FilterSheet />
      </div>
    </div>
  );
}

export function FilterSheet() {
  const {
    selectedPlatforms,
    selectedGames,
    showLiveOnly,
    togglePlatform,
    toggleGame,
    setShowLiveOnly,
    resetFilters,
  } = useFilterStore();

  const activeCount =
    selectedPlatforms.length + selectedGames.length + (showLiveOnly ? 1 : 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-white/10">
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-background border-white/5">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filters</span>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium mb-4">Status</h3>
            <button
              onClick={() => setShowLiveOnly(!showLiveOnly)}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all',
                showLiveOnly
                  ? 'bg-red-500/20 border border-red-500/30'
                  : 'bg-white/5 border border-transparent hover:bg-white/10'
              )}
            >
              <span
                className={cn(
                  'h-3 w-3 rounded-full',
                  showLiveOnly ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'
                )}
              />
              <div>
                <p className="font-medium">Live Matches Only</p>
                <p className="text-xs text-muted-foreground">
                  Show only matches currently in progress
                </p>
              </div>
              {showLiveOnly && <Check className="h-4 w-4 ml-auto text-red-400" />}
            </button>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-sm font-medium mb-4">Platforms</h3>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all',
                      isSelected
                        ? 'bg-white/10 border border-white/20'
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    )}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: `${platform.color}30` }}
                    >
                      {platform.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {platform.games.map((g) => GAMES.find((game) => game.id === g)?.name).join(', ')}
                      </p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-sm font-medium mb-4">Games</h3>
            <div className="flex flex-wrap gap-2">
              {GAMES.map((game) => {
                const isSelected = selectedGames.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => toggleGame(game.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {game.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function FilterPills({ className }: { className?: string }) {
  const {
    selectedPlatforms,
    selectedGames,
    showLiveOnly,
    togglePlatform,
    toggleGame,
    setShowLiveOnly,
  } = useFilterStore();

  const pills = [
    ...(showLiveOnly
      ? [{ type: 'status', label: 'Live Only', onRemove: () => setShowLiveOnly(false) }]
      : []),
    ...selectedPlatforms.map((p) => ({
      type: 'platform',
      label: PLATFORMS.find((pl) => pl.id === p)?.name || p,
      onRemove: () => togglePlatform(p),
    })),
    ...selectedGames.map((g) => ({
      type: 'game',
      label: GAMES.find((game) => game.id === g)?.name || g,
      onRemove: () => toggleGame(g),
    })),
  ];

  if (pills.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-muted-foreground">Active filters:</span>
      <AnimatePresence mode="popLayout">
        {pills.map((pill) => (
          <motion.div
            key={`${pill.type}-${pill.label}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
          >
            <Badge
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 cursor-pointer gap-1.5 pr-1.5"
              onClick={pill.onRemove}
            >
              {pill.label}
              <X className="h-3 w-3" />
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
