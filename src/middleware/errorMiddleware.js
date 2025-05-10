/**
 * Middleware de gestion des erreurs
 */

const logger = require('../services/logger');

/**
 * Middleware pour la gestion des routes non trouvées (404)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Middleware pour la gestion centralisée des erreurs
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Journaliser l'erreur (avec stack trace en développement)
  if (statusCode === 500) {
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (process.env.NODE_ENV !== 'production') {
      logger.error(err.stack);
    }
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  
  // Format de réponse JSON cohérent pour toutes les erreurs
  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Inclure la stack trace uniquement en développement
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * Middleware pour capturer les rejets de promesses non gérés
 */
const setupUncaughtErrors = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', reason);
    // En production, on ne ferme pas le serveur, mais on journalise l'erreur
  });
  
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    // En production, on ferme le serveur proprement
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
};

module.exports = {
  notFound,
  errorHandler,
  setupUncaughtErrors,
};