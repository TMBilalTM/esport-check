import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id;

    // Tüm maçları çek ve ID'ye göre filtrele
    const matchesResponse = await fetch(`${request.url.split('/match')[0]}/api/matches`, {
      next: { revalidate: 120 },
    });

    if (!matchesResponse.ok) {
      throw new Error('Failed to fetch matches');
    }

    const matches = await matchesResponse.json();
    const match = matches.find((m: any) => m.id === matchId);

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Match detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}
