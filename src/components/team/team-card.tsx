'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, TrendingUp, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FadeIn } from '@/components/ui/effects';
import { useFollowStore, useAuthStore } from '@/store';
import { cn, getCountryCode } from '@/lib/utils';
import type { Team } from '@/types';
import { GAMES } from '@/lib/data';
import { toast } from 'sonner';

interface TeamCardProps {
  team: Team;
  className?: string;
  showFollowButton?: boolean;
}

export function TeamCard({ team, className, showFollowButton = true }: TeamCardProps) {
  const [mounted, setMounted] = useState(false);
  const { isFollowing, addTeam, removeTeam } = useFollowStore();
  const { isAuthenticated } = useAuthStore();
  const game = GAMES.find((g) => g.id === team.game);
  const following = mounted ? isFollowing(team.id, team.platform) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <Link href={`/team/${team.id}`}>
      <Card className="group relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-white/10 card-hover h-full">
        {/* Brand color accent */}
        {team.brandColor && (
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: team.brandColor }}
          />
        )}
        
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16 rounded-xl bg-white/5 border-2" style={{ borderColor: team.brandColor || 'transparent' }}>
                <AvatarImage src={team.logo} className="object-contain p-2" />
                <AvatarFallback className="text-lg rounded-xl font-semibold" style={{ backgroundColor: `${team.brandColor}20`, color: team.brandColor }}>
                  {team.shortName || team.name.substring(0, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Region Flag Overlay - Replaces Game Icon */}
              {(team.region || team.country) && getCountryCode(team.region || team.country) && (
                <div
                  className="absolute -bottom-1 -right-1 h-6 w-8 rounded-md border-2 border-background flex items-center justify-center overflow-hidden bg-background shadow-sm"
                  title={team.region || team.country}
                >
                  <img 
                    src={`https://flagcdn.com/${getCountryCode(team.region || team.country)}.svg`}
                    alt={team.region || team.country}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            {showFollowButton && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg',
                  following
                    ? 'text-yellow-500 hover:text-yellow-400'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={handleFollowClick}
              >
                {following ? (
                  <Star className="h-4 w-4 fill-current" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {(team.region || team.country) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{team.region || team.country}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {game && (
              <Badge variant="secondary" className="bg-white/5 text-xs">
                {game.name}
              </Badge>
            )}
            {team.ranking && (
              <Badge variant="outline" className="border-white/10 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                #{team.ranking}
              </Badge>
            )}
          </div>

          {team.players && team.players.length > 0 && (
            <div className="mt-4 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <div className="flex -space-x-2">
                {team.players.slice(0, 5).map((player) => (
                  <Avatar key={player.id} className="h-6 w-6 border-2 border-card">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback className="text-[8px]">
                      {player.nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {team.players.length > 5 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{team.players.length - 5}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

interface TeamGridProps {
  teams: Team[];
  className?: string;
}

export function TeamGrid({ teams, className }: TeamGridProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
      {teams.map((team, index) => (
        <FadeIn key={team.id} delay={index * 0.05}>
          <TeamCard team={team} />
        </FadeIn>
      ))}
    </div>
  );
}

interface TeamRowProps {
  team: Team;
  className?: string;
  showStats?: boolean;
}

export function TeamRow({ team, className, showStats = false }: TeamRowProps) {
  const [mounted, setMounted] = useState(false);
  const { isFollowing, addTeam, removeTeam } = useFollowStore();
  const { isAuthenticated } = useAuthStore();
  const following = mounted ? isFollowing(team.id, team.platform) : false;
  const game = GAMES.find((g) => g.id === team.game);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to follow teams');
      return;
    }

    if (following) {
      removeTeam(team.id);
    } else {
      addTeam({
        teamId: team.id,
        platform: team.platform,
        game: team.game,
        teamName: team.name,
        teamLogo: team.logo,
      });
    }
  };

  return (
    <Link href={`/team/${team.id}`}>
      <div
        className={cn(
          'group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-white/10',
          className
        )}
      >
        <div className="flex items-center gap-1 text-muted-foreground w-8 justify-center shrink-0">
          {team.ranking && <span className="text-sm font-medium">#{team.ranking}</span>}
        </div>

        <Avatar className="h-10 w-10 rounded-lg bg-white/5 shrink-0">
          <AvatarImage src={team.logo} />
          <AvatarFallback className="text-xs rounded-lg">
            {team.shortName}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{team.name}</p>
          <p className="text-xs text-muted-foreground">{team.region}</p>
        </div>

        {game && (
          <Badge variant="secondary" className="bg-white/5 text-xs shrink-0">
            {game.name}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 shrink-0',
            following ? 'text-yellow-500' : 'text-muted-foreground'
          )}
          onClick={handleFollowClick}
        >
          <Star className={cn('h-4 w-4', following && 'fill-current')} />
        </Button>
      </div>
    </Link>
  );
}
