require('dotenv').config({path: './packages/backend/.env'});
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
console.log('URL de la base de données:', process.env.DATABASE_URL);

async function main() {
  try {
    console.log('Début du test de connexion à la base de données...');

    // Test de connexion basique
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connexion réussie!', result);

    // Création d'un utilisateur de test
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

    console.log('Utilisateur créé/mis à jour:', user);

    console.log('Test terminé avec succès!');
  } catch (error) {
    console.error('Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Déconnexion de la base de données');
  }
}

main();