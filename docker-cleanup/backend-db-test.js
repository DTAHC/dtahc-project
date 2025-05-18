// Script pour tester la connexion à la base de données
const { PrismaClient } = require('@prisma/client');
const express = require('express');

const app = express();
const port = 3001;
const prisma = new PrismaClient();

// Route de test de connexion à la base de données
app.get('/api/health', async (req, res) => {
  try {
    // Tester la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      message: 'API opérationnelle',
      database: 'connectée',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur de connexion à la base de données',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route pour créer un utilisateur de test
app.get('/api/setup', async (req, res) => {
  try {
    // Créer un utilisateur de test
    const user = await prisma.user.upsert({
      where: { email: 'admin@dtahc.fr' },
      update: {},
      create: {
        email: 'admin@dtahc.fr',
        firstName: 'Admin',
        lastName: 'DTAHC',
        password: '$2b$10$XEYLoXOIbKEDB8P9SEqyD.YnOL4Jtb2Tsl3q.Pyx8M2YJZ9UCcB/a', // admin123
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    
    res.json({
      status: 'ok',
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
});

// Route API de base
app.get('/api', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API DTAHC - Test DB',
    version: '1.0.0'
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur de test DB démarré sur le port ${port}`);
});