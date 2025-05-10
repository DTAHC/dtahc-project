/**
 * Service d'authentification
 * Note: Implémentation temporaire en attendant que bcrypt fonctionne correctement dans Docker
 */

const crypto = require('crypto');
const logger = require('./logger');

/**
 * Génère un hash pour un mot de passe (alternative temporaire à bcrypt)
 * @param {string} password - Mot de passe à hacher
 * @returns {string} Mot de passe haché
 */
const hashPassword = (password) => {
  try {
    // Générer un sel aléatoire
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Hacher le mot de passe avec le sel
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    // Retourner le sel et le hash séparés par un délimiteur
    return `${salt}:${hash}`;
  } catch (error) {
    logger.error(`Erreur lors du hachage du mot de passe: ${error.message}`);
    throw new Error('Erreur lors du hachage du mot de passe');
  }
};

/**
 * Compare un mot de passe avec un hash (alternative temporaire à bcrypt)
 * @param {string} password - Mot de passe à vérifier
 * @param {string} hashedPassword - Mot de passe haché à comparer
 * @returns {boolean} Vrai si le mot de passe correspond
 */
const comparePassword = (password, hashedPassword) => {
  try {
    // Extraire le sel et le hash du mot de passe haché
    const [salt, storedHash] = hashedPassword.split(':');
    
    // Hacher le mot de passe fourni avec le même sel
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    // Comparer les deux hash
    return storedHash === hash;
  } catch (error) {
    logger.error(`Erreur lors de la comparaison des mots de passe: ${error.message}`);
    return false;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};