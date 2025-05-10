/**
 * Point d'entrée principal de l'application DTAHC
 */

// Chargement des variables d'environnement
require('dotenv').config();

// Importations
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./services/logger');
const { setupSwagger } = require('./config/swagger');
const { connect } = require('./config/database');
const { setupSecurity } = require('./middleware/securityMiddleware');
const { notFound, errorHandler, setupUncaughtErrors } = require('./middleware/errorMiddleware');

// Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');

// Configuration
const PORT = process.env.PORT || 3000;
const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://dtahc.fr', 'https://www.dtahc.fr']
    : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware de base
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limiter la taille des requêtes JSON
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Configurer les middlewares de sécurité
setupSecurity(app);

// Middleware de journalisation des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Configuration Swagger
setupSwagger(app);

// Routes API
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/docs', swaggerRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l\'API DTAHC',
    version: '1.0.0',
    status: 'OK',
    docs: '/api-docs',
  });
});

// Route principale (pour SPA frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware pour les routes non trouvées (404)
app.use(notFound);

// Middleware de gestion centralisée des erreurs
app.use(errorHandler);

// Connexion à la base de données puis démarrage du serveur
const startServer = async () => {
  try {
    // Configurer la gestion des erreurs non capturées
    setupUncaughtErrors();

    // Connexion à MongoDB
    await connect();

    // Démarrage du serveur
    const server = app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
      logger.info(`API disponible sur http://localhost:${PORT}/api`);
      logger.info(`Documentation API sur http://localhost:${PORT}/api-docs`);
      logger.info(`Interface web disponible sur http://localhost:${PORT}`);
    });

    // Gestion de l'arrêt propre du serveur
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Serveur fermé');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    // Écouter les signaux de fermeture
    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler);
  } catch (error) {
    logger.error(`Erreur lors du démarrage du serveur: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Pour les tests