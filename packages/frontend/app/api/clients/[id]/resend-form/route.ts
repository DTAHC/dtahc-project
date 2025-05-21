import { NextRequest, NextResponse } from 'next/server';
import { sendClientFormLink } from '@/lib/api/clients';

/**
 * Gère la requête pour renvoyer un lien de formulaire à un client
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // Récupérer le corps de la requête (message personnalisé)
    const body = await request.json().catch(() => ({}));
    const customMessage = body?.customMessage || '';
    
    // Utiliser notre client API pour envoyer le lien
    // Cette fonction gère déjà la logique de simulation en environnement de développement
    const result = await sendClientFormLink(id, customMessage);
    
    // Retourner un succès
    return NextResponse.json({ success: true, data: result });
    
  } catch (error: any) {
    console.error(`Erreur lors du renvoi du lien au client ${id}:`, error);
    
    // Retourner une réponse d'erreur
    return NextResponse.json(
      { success: false, message: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}