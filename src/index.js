/**
 * Point d'entrée principal de l'application DTAHC
 */

// Chargement des variables d'environnement
require('dotenv').config();

// Importations
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./services/logger');

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

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Bienvenue sur l\'API DTAHC',
    version: '1.0.0',
    status: 'OK'
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(`Erreur: ${err.message}`);
  res.status(500).json({ error: 'Erreur serveur', message: err.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app; // Pour les tests