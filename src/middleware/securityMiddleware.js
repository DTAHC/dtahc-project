/**
 * Middleware de sécurité
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Configuration du limiteur de requêtes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true, // Renvoie l'info rate limit dans les headers
  legacyHeaders: false, // Désactive les headers X-RateLimit
  message: {
    success: false,
    message: 'Trop de requêtes effectuées, veuillez réessayer plus tard',
  },
});

// Configuration du limiteur pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // limite chaque IP à 10 requêtes par heure
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard',
  },
});

/**
 * Applique les middlewares de sécurité à l'application Express
 * @param {Object} app - Instance Express
 */
const setupSecurity = (app) => {
  // Helmet (sécurité des headers HTTP)
  app.use(helmet());
  
  // Limiter le taux de requêtes API
  app.use('/api', apiLimiter);
  
  // Limiter les tentatives d'authentification
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  
  // Prévenir les injections NoSQL
  app.use(mongoSanitize());
  
  // Prévenir les attaques XSS
  app.use(xss());
  
  // Prévenir la pollution des paramètres HTTP
  app.use(hpp());
  
  // Désactiver l'en-tête X-Powered-By
  app.disable('x-powered-by');
};

module.exports = {
  setupSecurity,
  apiLimiter,
  authLimiter,
};