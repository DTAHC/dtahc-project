import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to get all dossiers for a specific client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API Route: Fetching dossiers for client ${id}`);
    
    // 1. Récupérer tous les dossiers
    const allDossiersResponse = await fetch(`${request.nextUrl.origin}/api/dossiers`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
    });
    
    if (!allDossiersResponse.ok) {
      console.error('API Route: Error fetching all dossiers');
      return NextResponse.json(
        { error: 'Failed to fetch dossiers' },
        { status: allDossiersResponse.status }
      );
    }
    
    const allDossiers = await allDossiersResponse.json();
    
    // 2. Filtrer uniquement les dossiers du client spécifié
    const clientDossiers = allDossiers.filter((dossier: any) => dossier.clientId === id);
    
    console.log(`API Route: Found ${clientDossiers.length} dossiers for client ${id}`);
    
    return NextResponse.json(clientDossiers);
  } catch (error: any) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error retrieving client dossiers' },
      { status: 500 }
    );
  }
}