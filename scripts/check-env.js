#!/usr/bin/env node

/**
 * Script pour vérifier l'environnement de développement
 * Exécuter avec: npm run check:env
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration requise
const requiredNodeVersion = '18.0.0';
const requiredNpmVersion = '8.0.0';

console.log(chalk.blue('🔍 Vérification de l'environnement DTAHC'));
console.log(chalk.blue('=========================================='));

let hasErrors = false;

// Fonction pour vérifier la version
function checkVersion(actual, required, name) {
  if (compareVersions(actual, required) < 0) {
    console.log(chalk.red(`❌ ${name} version ${actual} détectée, ${required}+ requise`));
    hasErrors = true;
    return false;
  } else {
    console.log(chalk.green(`✅ ${name} version ${actual} (OK)`));
    return true;
  }
}

// Comparaison simple de versions
function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const verA = partsA[i] || 0;
    const verB = partsB[i] || 0;
    
    if (verA > verB) return 1;
    if (verA < verB) return -1;
  }
  
  return 0;
}

// Vérifier Node.js
try {
  const nodeVersion = execSync('node --version').toString().trim().replace('v', '');
  checkVersion(nodeVersion, requiredNodeVersion, 'Node.js');
} catch (error) {
  console.log(chalk.red('❌ Node.js non détecté'));
  hasErrors = true;
}

// Vérifier NPM
try {
  const npmVersion = execSync('npm --version').toString().trim();
  checkVersion(npmVersion, requiredNpmVersion, 'npm');
} catch (error) {
  console.log(chalk.red('❌ npm non détecté'));
  hasErrors = true;
}

// Vérifier les fichiers d'environnement
console.log(chalk.blue('\n📁 Vérification des fichiers'));

const backendEnvPath = path.join(__dirname, '..', 'packages', 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log(chalk.green('✅ Fichier .env backend trouvé'));
} else {
  console.log(chalk.yellow('⚠️ Fichier .env backend non trouvé - veuillez le créer'));
}

// Vérifier les dossiers requis
console.log(chalk.blue('\n📁 Vérification de la structure du projet'));
const requiredDirs = [
  'packages/backend',
  'packages/frontend',
  'packages/shared',
  'docker'
];

for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', ...dir.split('/'));
  if (fs.existsSync(dirPath)) {
    console.log(chalk.green(`✅ Dossier ${dir} trouvé`));
  } else {
    console.log(chalk.red(`❌ Dossier ${dir} manquant`));
    hasErrors = true;
  }
}

// Vérifier les dépendances
console.log(chalk.blue('\n📦 Vérification des dépendances'));
try {
  execSync('npm ls --depth=0', { stdio: 'ignore' });
  console.log(chalk.green('✅ Dépendances installées correctement'));
} catch (error) {
  console.log(chalk.yellow('⚠️ Problèmes détectés avec les dépendances, exécutez npm install'));
}

// Vérifier Docker
console.log(chalk.blue('\n🐳 Vérification de Docker'));
try {
  execSync('docker --version', { stdio: 'ignore' });
  console.log(chalk.green('✅ Docker installé'));
  
  execSync('docker-compose --version', { stdio: 'ignore' });
  console.log(chalk.green('✅ Docker Compose installé'));
} catch (error) {
  console.log(chalk.yellow('⚠️ Docker ou Docker Compose non détecté - requis pour l\'environnement de production'));
}

// Vérifier Git
console.log(chalk.blue('\n🔄 Vérification de Git'));
try {
  execSync('git --version', { stdio: 'ignore' });
  console.log(chalk.green('✅ Git installé'));
  
  const isGitRepo = fs.existsSync(path.join(__dirname, '..', '.git'));
  if (isGitRepo) {
    console.log(chalk.green('✅ Dépôt Git initialisé'));
  } else {
    console.log(chalk.yellow('⚠️ Dépôt Git non initialisé - exécutez git init'));
  }
} catch (error) {
  console.log(chalk.red('❌ Git non détecté'));
  hasErrors = true;
}

// Résultat final
console.log(chalk.blue('\n=========================================='));
if (hasErrors) {
  console.log(chalk.red('❌ Des problèmes ont été détectés dans votre environnement. Veuillez les corriger avant de continuer.'));
  process.exit(1);
} else {
  console.log(chalk.green('✅ Environnement correctement configuré ! Prêt pour le développement.'));
  process.exit(0);
}