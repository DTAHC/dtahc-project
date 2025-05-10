/**
 * Configuration de la connexion à MongoDB
 */

const mongoose = require('mongoose');
const logger = require('../services/logger');

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

/**
 * Connecte l'application à la base de données MongoDB
 */
async function connect() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dtahc';
    
    await mongoose.connect(mongoURI, options);
    
    logger.info('Connexion à MongoDB établie');
    
    // Événements de connexion
    mongoose.connection.on('error', (err) => {
      logger.error(`Erreur de connexion MongoDB: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Déconnecté de MongoDB');
    });
    
    // Gérer la fermeture de la connexion lors de l'arrêt de l'application
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Connexion MongoDB fermée suite à l\'arrêt de l\'application');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (err) {
    logger.error(`Impossible de se connecter à MongoDB: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { connect };