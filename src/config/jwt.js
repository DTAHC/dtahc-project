/**
 * Configuration JWT pour l'authentification
 */

const jwt = require('jsonwebtoken');
const logger = require('../services/logger');

// Secret pour signer les tokens JWT (utiliser la variable d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_uniquement_changer_en_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - Objet utilisateur (sans le mot de passe)
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
  try {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    logger.error(`Erreur lors de la génération du token JWT: ${error.message}`);
    throw new Error('Erreur lors de la génération du token');
  }
};

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Token JWT à vérifier
 * @returns {Object} Payload décodé ou null si invalide
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error(`Token JWT invalide: ${error.message}`);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};