import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Bell,
  Globe,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MatchCard } from '@/components/match/match-card';
import { TeamCard } from '@/components/team/team-card';
import { FadeIn, StaggerContainer, StaggerItem, Spotlight, LiveIndicator } from '@/components/ui/effects';
import { fetchMatches, fetchTeams, PLATFORMS, GAMES } from '@/lib/data';

const features = [
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Live scores and match updates as they happen, directly from source platforms.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get notified when your followed teams start playing or matches end.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Track matches from VLR.gg, HLTV, Liquipedia, and more in one place.',
  },
  {
    icon: Shield,
    title: 'Reliable Data',
    description: 'Data sourced directly from official platforms for accuracy.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '1000+', label: 'Teams Tracked' },
  { value: '500+', label: 'Daily Matches' },
  { value: '99.9%', label: 'Uptime' },
];

export default async function HomePage() {
  // Gerçek verileri çek
  const allMatches = await fetchMatches();
  const allTeams = await fetchTeams();
  
  const liveMatches = allMatches.filter((m) => m.status === 'live');
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming').slice(0, 3);
  const featuredTeams = allTeams.slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <FadeIn>
                <Badge variant="outline" className="mb-6 border-white/10 bg-white/5 px-4 py-1.5">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Now tracking 500+ live matches
                </Badge>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Never miss an
                  <span className="block text-muted-foreground">esports match</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                  Track your favorite teams across VLR.gg, HLTV, and more. Real-time scores, 
                  match countdowns, and instant notifications—all in one place.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/matches">
                    <Button size="lg" className="h-12 px-8 text-base">
                      View Live Matches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/teams">
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/10">
                      Browse Teams
                    </Button>
                  </Link>
                </div>
              </FadeIn>

              {/* Platform Logos */}
              <FadeIn delay={0.4}>
                <div className="mt-12 flex items-center gap-6">
                  <span className="text-sm text-muted-foreground">Tracking from:</span>
                  <div className="flex items-center gap-4">
                    {PLATFORMS.map((platform) => (
                      <div
                        key={platform.id}
                        className="flex items-center justify-center h-8 px-3 rounded-md bg-white/5 text-sm font-medium text-muted-foreground"
                      >
                        {platform.name}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Content - Live Matches Preview */}
            <FadeIn delay={0.3} direction="left">
              <div className="relative">
                {liveMatches.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <LiveIndicator />
                        <span className="text-sm font-medium">Live Now</span>
                      </div>
                      <Link href="/matches?status=live" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        View all <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    {liveMatches.slice(0, 2).map((match) => (
                      <MatchCard key={match.id} match={match} variant="featured" />
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <p className="font-display text-4xl lg:text-5xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold">
                Everything you need to track esports
              </h2>
              <p className="mt-4 text-muted-foreground">
                Powerful features designed for the most dedicated esports fans.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title}>
                  <Card className="h-full border-white/5 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-24 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold">Upcoming Matches</h2>
                <p className="mt-2 text-muted-foreground">Don&apos;t miss these exciting matchups</p>
              </div>
              <Link href="/matches">
                <Button variant="outline" className="border-white/10">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match, index) => (
              <FadeIn key={match.id} delay={index * 0.1}>
                <MatchCard match={match} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold">
                All your favorite games
              </h2>
              <p className="mt-4 text-muted-foreground">
                We support the most popular competitive games worldwide.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GAMES.map((game) => (
              <StaggerItem key={game.id}>
                <Link href={`/matches?game=${game.id}`}>
                  <Card className="group h-full border-white/5 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-white/10 transition-all cursor-pointer overflow-hidden">
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: game.color }}
                    />
                    <CardContent className="p-6 text-center">
                      <div
                        className="h-16 w-16 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: `${game.color}15` }}
                      >
                        <img src={game.icon} alt={game.name} className="h-12 w-12 object-contain" />
                      </div>
                      <h3 className="font-medium text-sm">{game.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Teams Section */}
      <section className="py-24 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold">Top Teams</h2>
                <p className="mt-2 text-muted-foreground">Follow the best teams in esports</p>
              </div>
              <Link href="/teams">
                <Button variant="outline" className="border-white/10">
                  View All Teams
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeams.map((team, index) => (
              <FadeIn key={team.id} delay={index * 0.1}>
                <TeamCard team={team} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
              <CardContent className="relative py-16 px-8 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                  Ready to never miss a match?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                  Join thousands of esports fans tracking their favorite teams and matches in real-time.
                </p>
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
