/**
 * Point d'entrée principal de l'application DTAHC
 */

// Chargement des variables d'environnement
require('dotenv').config();

// Importations
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./services/logger');
const { setupSwagger } = require('./config/swagger');
const { connect } = require('./config/database');

// Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');

// Configuration
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(`Erreur: ${err.message}`);
  res.status(500).json({ error: 'Erreur serveur', message: err.message });
});

// Connexion à la base de données puis démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connect();

    // Démarrage du serveur
    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
      logger.info(`API disponible sur http://localhost:${PORT}/api`);
      logger.info(`Documentation API sur http://localhost:${PORT}/api-docs`);
      logger.info(`Interface web disponible sur http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Erreur lors du démarrage du serveur: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Pour les tests