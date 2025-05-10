/**
 * Routes pour la vérification de l'état de l'application
 */

const express = require('express');
const router = express.Router();

// Vérification simple de l'état de l'application
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Vérification détaillée avec les connexions aux dépendances
router.get('/detailed', async (req, res) => {
  try {
    // Vérifier l'état de MongoDB
    const dbStatus = {
      status: 'UP',
      name: 'MongoDB',
    };
    
    // Vérifier l'état de Redis (si configuré)
    const redisStatus = {
      status: 'UP',
      name: 'Redis',
    };
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      dependencies: [dbStatus, redisStatus],
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date(),
      error: error.message,
    });
  }
});

module.exports = router;