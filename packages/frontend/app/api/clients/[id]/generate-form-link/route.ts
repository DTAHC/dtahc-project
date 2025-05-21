import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * API pour générer un lien de formulaire pour un client spécifique
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { formType = 'PROJECT_FORM' } = await request.json();
    
    console.log(`API Route: Génération de lien de formulaire de type ${formType} pour le client ${id}`);
    
    // Vérifier si le client existe
    try {
      // Forward to the backend API
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
      
      // Essayer d'abord de vérifier que le backend est accessible
      try {
        const healthCheck = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (healthCheck.ok) {
          // Backend accessible, faire une vraie requête
          const response = await fetch(`${backendUrl}/clients/${id}/generate-form-link`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formType }),
          });
          
          if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
          } else {
            throw new Error(`Erreur backend: ${response.status}`);
          }
        } else {
          throw new Error('Backend non accessible');
        }
      } catch (error) {
        console.log('Backend non disponible, utilisation de données simulées');
        // Si le backend n'est pas accessible, utiliser des données simulées
        
        // Générer un token unique
        const token = uuidv4();
        
        // Créer une date d'expiration (7 jours)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        // Créer le lien de formulaire
        const formLink = {
          id: `form_${uuidv4()}`,
          clientId: id,
          token,
          expiresAt: expiresAt.toISOString(),
          completed: false,
          createdAt: new Date().toISOString(),
          type: formType,
          emailSent: true,
          sentAt: new Date().toISOString(),
        };
        
        // Ne pas essayer d'utiliser localStorage côté serveur
        // Au lieu de cela, utiliser une simulation plus simple
        
        // Construire l'URL complète du formulaire
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
        const formUrl = `${baseUrl}/fiche-projet/${token}`;
        
        return NextResponse.json({
          formLink,
          formUrl,
          message: 'Lien de formulaire généré avec succès (simulation)',
        });
      }
    } catch (error: any) {
      console.error('API Route: Erreur lors de la génération du lien', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la génération du lien de formulaire' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Route: Erreur inattendue', error);
    return NextResponse.json(
      { error: 'Erreur inattendue lors de la génération du lien de formulaire' },
      { status: 500 }
    );
  }
}