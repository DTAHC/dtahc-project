/**
 * Formate l'identifiant d'un dossier pour un affichage court et cohérent
 * @param id L'identifiant complet du dossier (UUID)
 * @param reference La référence du dossier (format DOS-YYYY-XXX)
 * @returns Un identifiant court et lisible
 */
export const formatDossierId = (id?: string, reference?: string): string => {
  // Utiliser la référence si elle existe (format DOS-YYYY-XXX)
  if (reference) {
    return reference;
  }
  
  // Sinon utiliser les 8 premiers caractères de l'UUID
  if (id) {
    return id.substring(0, 8);
  }
  
  // Fallback si aucun identifiant n'est disponible
  return 'N/A';
};

/**
 * Formate l'identifiant d'un client pour un affichage court et cohérent
 * @param id L'identifiant complet du client (UUID)
 * @param reference La référence du client (format CL-YYYY-XXX)
 * @returns Un identifiant court et lisible
 */
export const formatClientId = (id?: string, reference?: string): string => {
  // Utiliser la référence si elle existe (format CL-YYYY-XXX)
  if (reference) {
    return reference;
  }
  
  // Sinon utiliser les 8 premiers caractères de l'UUID
  if (id) {
    return id.substring(0, 8);
  }
  
  // Fallback si aucun identifiant n'est disponible
  return 'N/A';
};

/**
 * Formate une date pour un affichage cohérent en français
 * @param date La date à formater (Date ou chaîne ISO)
 * @returns La date formatée en JJ/MM/AAAA HH:MM
 */
export const formatDate = (date?: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'N/A';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};