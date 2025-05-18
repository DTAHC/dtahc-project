// Serveur temporaire pour tester la connexion à la base de données
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3001;

// Créer une instance Prisma
const prisma = new PrismaClient();

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

app.listen(port, () => {
  console.log(`Serveur simplifié démarré sur le port ${port}`);
});
EOL < /dev/null