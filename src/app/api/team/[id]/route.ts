import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;

    // Tüm takımları çek ve ID'ye göre filtrele
    const teamsResponse = await fetch(`${request.url.split('/team')[0]}/api/teams`, {
      next: { revalidate: 600 },
    });

    if (!teamsResponse.ok) {
      throw new Error('Failed to fetch teams');
    }

    const teams = await teamsResponse.json();
    const team = teams.find((t: any) => t.id === teamId);

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Team detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
