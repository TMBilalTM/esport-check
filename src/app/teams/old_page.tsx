import { fetchTeams } from '@/lib/data';
import { TeamsClient } from '@/components/team/teams-client';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const teams = await fetchTeams();

  return <TeamsClient initialTeams={teams} />;
}
