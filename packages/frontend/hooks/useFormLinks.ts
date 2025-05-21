import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function useFormLinks() {
  const [isResending, setIsResending] = useState<{ [clientId: string]: boolean }>({});
  const [isClient, setIsClient] = useState(false);
  
  // Détecter si nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  /**
   * Renvoie un lien de formulaire à un client
   */
  const resendFormLink = async (clientId: string) => {
    // Ne rien faire si on est côté serveur
    if (!isClient) {
      console.warn('Tentative d\'envoi côté serveur, ignoré');
      return false;
    }
    
    // Mettre à jour l'état pour indiquer que l'envoi est en cours
    setIsResending(prev => ({ ...prev, [clientId]: true }));
    
    try {
      // Importer dynamiquement le client API
      const { sendClientFormLink } = await import('@/lib/api/clients');

      try {
        const result = await sendClientFormLink(clientId);
        toast.success('Lien de formulaire envoyé avec succès');
        return true;
      } catch (apiError) {
        // Propager l'erreur pour qu'elle soit gérée dans le bloc catch principal
        throw apiError;
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || "Erreur lors de l'envoi du lien");
      return false;
    } finally {
      // Réinitialiser l'état d'envoi
      setIsResending(prev => ({ ...prev, [clientId]: false }));
    }
  };
  
  /**
   * Vérifie si un lien est en cours d'envoi pour un client donné
   */
  const isResendingLink = (clientId: string) => {
    // Sécurité pour le SSR
    if (!isClient) return false;
    return !!isResending[clientId];
  };
  
  return {
    resendFormLink,
    isResendingLink,
  };
}