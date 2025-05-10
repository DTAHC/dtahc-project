/**
 * Middleware d'authentification
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const logger = require('../services/logger');

/**
 * Middleware pour vérifier l'authentification JWT
 * Ajoute l'utilisateur décodé à req.user si le token est valide
 */
const authenticate = (req, res, next) => {
  try {
    // Récupérer le token d'autorisation
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé. Token manquant.', 
      });
    }
    
    // Extraire le token du header
    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter l'utilisateur décodé à l'objet req
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error(`Erreur d'authentification: ${error.message}`);
    return res.status(401).json({ 
      success: false, 
      message: 'Accès non autorisé. Token invalide.', 
    });
  }
};

/**
 * Middleware pour vérifier les rôles d'utilisateur
 * @param {Array} roles - Tableau des rôles autorisés
 */
const authorize = (roles = []) => {
  // Convertir en tableau si string
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié.',
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous n\'avez pas les permissions nécessaires pour cette action.',
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};