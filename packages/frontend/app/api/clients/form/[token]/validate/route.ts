import { NextRequest, NextResponse } from 'next/server';

/**
 * Gère la requête pour valider un token de formulaire client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  
  try {
    // Récupérer la configuration de l'API backend depuis les variables d'environnement
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
    
    // Envoyer la requête au backend
    const response = await fetch(`${apiUrl}/clients/form/${token}/validate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Récupérer les données de la réponse
    const data = await response.json();
    
    // Retourner la réponse telle quelle
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error(`Erreur lors de la validation du token ${token}:`, error);
    
    // Retourner une réponse d'erreur
    return NextResponse.json(
      { valid: false, message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}