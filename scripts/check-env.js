/**
 * Script de vérification de l'environnement pour le développement
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Vérification de l'environnement de développement...');

// Vérifier que le fichier .env existe
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Le fichier .env n\'existe pas. Veuillez créer un fichier .env à partir de .env.example');
  process.exit(1);
}
console.log('✅ Fichier .env trouvé');

// Vérifier que Docker est installé
try {
  execSync('docker --version', { stdio: 'pipe' });
  console.log('✅ Docker est installé');
} catch (error) {
  console.error('❌ Docker n\'est pas installé ou n\'est pas disponible dans le PATH');
  process.exit(1);
}

// Vérifier que Docker Compose est installé
try {
  execSync('docker compose version', { stdio: 'pipe' });
  console.log('✅ Docker Compose est installé');
} catch (error) {
  console.error('❌ Docker Compose n\'est pas installé ou n\'est pas disponible dans le PATH');
  process.exit(1);
}

// Vérifier que Node.js est installé avec la bonne version
try {
  const nodeVersion = execSync('node --version', { stdio: 'pipe' }).toString().trim();
  console.log(`✅ Node.js est installé (${nodeVersion})`);
  
  const versionNumber = nodeVersion.replace('v', '').split('.')[0];
  if (parseInt(versionNumber) < 18) {
    console.warn('⚠️ La version de Node.js est inférieure à 18. Il est recommandé d\'utiliser Node.js 18 ou supérieur.');
  }
} catch (error) {
  console.error('❌ Node.js n\'est pas installé ou n\'est pas disponible dans le PATH');
  process.exit(1);
}

// Vérifier que Git est installé
try {
  execSync('git --version', { stdio: 'pipe' });
  console.log('✅ Git est installé');
} catch (error) {
  console.error('❌ Git n\'est pas installé ou n\'est pas disponible dans le PATH');
  process.exit(1);
}

// Vérifier que les répertoires nécessaires existent
const dirsToCheck = ['logs', 'uploads', 'public'];
dirsToCheck.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Le répertoire "${dir}" n'existe pas. Veuillez le créer.`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Répertoire "${dir}" créé automatiquement`);
  } else {
    console.log(`✅ Répertoire "${dir}" trouvé`);
  }
});

console.log('\n🎉 Votre environnement de développement est prêt!');
console.log('\nCommandes utiles:');
console.log('- npm install     : Installer les dépendances');
console.log('- npm run dev     : Démarrer le serveur en mode développement');
console.log('- npm test        : Exécuter les tests');
console.log('- npm run lint    : Vérifier le style du code');
console.log('- docker compose up -d : Démarrer les services Docker');
console.log('- git status      : Vérifier l\'état de Git');