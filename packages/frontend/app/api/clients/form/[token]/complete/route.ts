import { NextRequest, NextResponse } from 'next/server';

/**
 * Gère la requête pour soumettre un formulaire client complété
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  
  try {
    // Récupérer les données du formulaire depuis la requête
    const formData = await request.json();
    
    // Récupérer la configuration de l'API backend depuis les variables d'environnement
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
    
    // Envoyer la requête au backend
    const response = await fetch(`${apiUrl}/clients/form/${token}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    // Récupérer les données de la réponse
    const data = await response.json();
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }
    
    // Retourner la réponse
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error(`Erreur lors de la soumission du formulaire ${token}:`, error);
    
    // Retourner une réponse d'erreur
    return NextResponse.json(
      { success: false, message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}