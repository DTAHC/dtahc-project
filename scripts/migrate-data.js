#!/usr/bin/env node

/**
 * Script pour migrer les données de l'ancien système vers le nouveau
 * À exécuter uniquement lors de la mise en place initiale
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔄 Migration des données DTAHC'));
console.log(chalk.blue('=============================='));

// Chemin vers les répertoires
const SOURCE_DIR = path.join(__dirname, '..', 'element-david');
const TARGET_DIR = path.join(__dirname, '..');

// Fonction pour copier les fichiers de référence
function copyReferenceFiles() {
  console.log(chalk.blue('\n📋 Copie des fichiers de référence...'));
  
  // Vérifier que le répertoire source existe
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(chalk.red('❌ Répertoire source non trouvé:', SOURCE_DIR));
    return false;
  }
  
  // S'assurer que le répertoire des références existe
  const referencesDir = path.join(TARGET_DIR, 'references');
  if (!fs.existsSync(referencesDir)) {
    fs.mkdirSync(referencesDir, { recursive: true });
    console.log(chalk.green('✅ Répertoire des références créé:', referencesDir));
  }
  
  // Copier tous les fichiers
  let filesCopied = 0;
  try {
    const files = fs.readdirSync(SOURCE_DIR);
    for (const file of files) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const targetPath = path.join(referencesDir, file);
      
      // Vérifier si c'est un fichier
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, targetPath);
        filesCopied++;
        console.log(chalk.green(`✅ Copié: ${file}`));
      }
    }
    
    console.log(chalk.green(`\n✅ ${filesCopied} fichiers copiés avec succès.`));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Erreur lors de la copie des fichiers:`, error.message));
    return false;
  }
}

// Fonction pour créer les exemples de répertoires et fichiers
function createExampleStructure() {
  console.log(chalk.blue('\n📁 Création des exemples de structure...'));
  
  const examples = [
    'examples/clients',
    'examples/documents',
    'examples/templates/email',
    'examples/templates/pdf',
  ];
  
  for (const dir of examples) {
    const dirPath = path.join(TARGET_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(chalk.green(`✅ Créé: ${dir}`));
    }
  }
  
  // Créer quelques fichiers d'exemple
  const exampleFiles = [
    { path: 'examples/clients/README.md', content: '# Exemples de clients\n\nCe répertoire contient des exemples de données clients pour le développement.' },
    { path: 'examples/documents/README.md', content: '# Exemples de documents\n\nCe répertoire contient des exemples de documents pour le développement.' },
    { path: 'examples/templates/email/README.md', content: '# Templates d\'email\n\nCe répertoire contient des templates d\'email pour les communications.' },
    { path: 'examples/templates/pdf/README.md', content: '# Templates PDF\n\nCe répertoire contient des templates PDF pour les documents générés.' },
  ];
  
  for (const file of exampleFiles) {
    const filePath = path.join(TARGET_DIR, file.path);
    fs.writeFileSync(filePath, file.content);
    console.log(chalk.green(`✅ Créé: ${file.path}`));
  }
  
  return true;
}

// Exécution principale
async function main() {
  let success = true;
  
  success = copyReferenceFiles() && success;
  success = createExampleStructure() && success;
  
  console.log(chalk.blue('\n=============================='));
  if (success) {
    console.log(chalk.green('✅ Migration des données terminée avec succès !'));
    return 0;
  } else {
    console.log(chalk.red('❌ Des erreurs se sont produites pendant la migration.'));
    return 1;
  }
}

// Exécuter le script
main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(chalk.red('Erreur non gérée:'), err);
    process.exit(1);
  }
);