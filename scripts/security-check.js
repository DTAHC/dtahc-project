/**
 * Script de vérification de sécurité
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Variables globales
const baseUrl = process.env.API_URL || 'http://localhost:3000';
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Effectue une requête HTTP
 * @param {string} method - Méthode HTTP
 * @param {string} path - Chemin de l'URL
 * @param {Object} headers - Headers HTTP
 * @param {Object} body - Corps de la requête
 * @returns {Promise<Object>} - Réponse
 */
const request = (method, path, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 5000
    };
    
    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data.length > 0 ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            error: error.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
};

/**
 * Affiche le résultat d'un test
 * @param {string} testName - Nom du test
 * @param {boolean} passed - Si le test a réussi
 * @param {string} message - Message à afficher
 */
const reportTest = (testName, passed, message) => {
  testsRun++;
  if (passed) {
    testsPassed++;
    console.log(`${colors.green}✓ PASS${colors.reset} ${testName} - ${message}`);
  } else {
    testsFailed++;
    console.log(`${colors.red}✗ FAIL${colors.reset} ${testName} - ${message}`);
  }
};

/**
 * Exécute tous les tests de sécurité
 */
const runTests = async () => {
  console.log(`\n${colors.cyan}=== Tests de sécurité pour l'API DTAHC ===${colors.reset}\n`);
  console.log(`${colors.blue}URL de base: ${baseUrl}${colors.reset}\n`);
  
  try {
    // Test 1: Vérifier que les headers de sécurité sont présents
    const res1 = await request('GET', '/api/health');
    const securityHeaders = [
      'x-content-type-options',
      'x-xss-protection',
      'x-frame-options',
      'content-security-policy'
    ];
    
    const foundHeaders = Object.keys(res1.headers).map(h => h.toLowerCase());
    const missingHeaders = securityHeaders.filter(h => !foundHeaders.includes(h));
    
    reportTest(
      "Headers de sécurité",
      missingHeaders.length === 0,
      missingHeaders.length === 0 
        ? "Tous les headers de sécurité sont présents"
        : `Headers manquants: ${missingHeaders.join(', ')}`
    );
    
    // Test 2: Vérifier la limitation de débit
    console.log(`\n${colors.yellow}Test de limitation de débit (cela peut prendre quelques secondes)...${colors.reset}`);
    let rateLimitHit = false;
    for (let i = 0; i < 12; i++) {
      const authRes = await request('POST', '/api/auth/login', {}, {
        email: `wrong${i}@example.com`,
        password: 'wrongPassword'
      });
      
      if (authRes.statusCode === 429) {
        rateLimitHit = true;
        break;
      }
    }
    
    reportTest(
      "Protection contre les attaques par force brute",
      rateLimitHit,
      rateLimitHit 
        ? "La limitation de débit fonctionne correctement"
        : "La limitation de débit n'a pas été déclenchée"
    );
    
    // Test 3: Vérifier la validation des données
    const badDataRes = await request('POST', '/api/auth/register', {}, {
      username: "te", // Trop court
      email: "bad-email", // Email invalide
      password: "123", // Mot de passe trop court
      name: "" // Nom vide
    });
    
    reportTest(
      "Validation des données",
      badDataRes.statusCode === 400 && badDataRes.body && badDataRes.body.errors,
      badDataRes.statusCode === 400
        ? "La validation des données fonctionne correctement"
        : "La validation des données n'a pas fonctionné comme prévu"
    );
    
    // Test 4: Vérifier la protection contre NoSQL Injection
    const injectionTest = await request('POST', '/api/auth/login', {}, {
      email: { $ne: null },
      password: { $ne: null }
    });
    
    reportTest(
      "Protection contre les injections NoSQL",
      injectionTest.statusCode !== 200 || !injectionTest.body.success,
      injectionTest.statusCode !== 200 || !injectionTest.body.success
        ? "Protection contre les injections NoSQL en place"
        : "Vulnérable aux injections NoSQL"
    );
    
    // Test 5: Vérifier la route 404
    const notFoundRes = await request('GET', '/api/not-existing-route');
    
    reportTest(
      "Gestion des routes inexistantes",
      notFoundRes.statusCode === 404,
      notFoundRes.statusCode === 404
        ? "Les routes inexistantes sont correctement gérées"
        : `Code de statut incorrect: ${notFoundRes.statusCode}`
    );
    
    // Test 6: Vérifier l'authentification JWT
    const protectedRoute = await request('GET', '/api/auth/me');
    
    reportTest(
      "Protection des routes authentifiées",
      protectedRoute.statusCode === 401,
      protectedRoute.statusCode === 401
        ? "Les routes protégées requièrent une authentification"
        : `Code de statut incorrect: ${protectedRoute.statusCode}`
    );
    
    // Récapitulatif
    console.log(`\n${colors.cyan}=== Récapitulatif des tests ===${colors.reset}`);
    console.log(`${colors.white}Tests exécutés: ${testsRun}${colors.reset}`);
    console.log(`${colors.green}Tests réussis: ${testsPassed}${colors.reset}`);
    console.log(`${colors.red}Tests échoués: ${testsFailed}${colors.reset}`);
    
    console.log(`\n${testsFailed === 0 
      ? `${colors.green}✓ Tous les tests ont réussi!${colors.reset}`
      : `${colors.red}✗ Certains tests ont échoué!${colors.reset}`}`);
    
  } catch (error) {
    console.error(`${colors.red}Erreur lors de l'exécution des tests: ${error.message}${colors.reset}`);
  }
};

// Exécuter les tests
runTests();