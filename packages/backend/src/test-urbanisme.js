const axios = require('axios');

/**
 * Script de test pour les fonctionnalités d'urbanisme et cadastre
 * Ce script teste les différentes API que nous avons implémentées
 */

const API_URL = 'http://localhost:3001/api';

async function testCadastreAPI() {
  console.log('Test de l\'API Cadastre...');
  
  try {
    // Test de récupération d'une parcelle par référence
    const parcelleResponse = await axios.post(`${API_URL}/cadastre/parcelle/reference`, {
      codeInsee: '75101',
      section: 'AB',
      numero: '0123'
    });
    
    console.log('✅ Récupération de parcelle par référence:', 
      parcelleResponse.data.success ? 'Succès' : 'Échec');
    
    if (parcelleResponse.data.success) {
      const parcelleInfo = parcelleResponse.data.data;
      console.log(`   Commune: ${parcelleInfo.commune}, Section: ${parcelleInfo.section}, Numéro: ${parcelleInfo.numero}`);
    }
    
    // Test de génération de carte
    const mapResponse = await axios.post(`${API_URL}/cadastre/generate-map`, {
      codeInsee: '75101',
      section: 'AB',
      numero: '0123',
      scale: 500
    });
    
    console.log('✅ Génération de plan cadastral:', 
      mapResponse.data.success ? 'Succès' : 'Échec');
    
    if (mapResponse.data.success && mapResponse.data.html) {
      console.log(`   Plan HTML généré: ${mapResponse.data.html.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API Cadastre:', error.message);
    if (error.response) {
      console.error('   Réponse d\'erreur:', error.response.data);
    }
  }
}

async function testUrbanismeAPI() {
  console.log('\nTest de l\'API Urbanisme...');
  
  try {
    // Test de récupération des informations d'urbanisme par parcelle
    const urbanismeResponse = await axios.post(`${API_URL}/urbanisme/info-by-parcelle`, {
      codeInsee: '75101',
      section: 'AB',
      numero: '0123'
    });
    
    console.log('✅ Récupération des informations d\'urbanisme:', 
      urbanismeResponse.data.success ? 'Succès' : 'Échec');
    
    if (urbanismeResponse.data.success) {
      const urbanismeInfo = urbanismeResponse.data.urbanisme;
      if (urbanismeInfo.document) {
        console.log(`   Document d'urbanisme: ${urbanismeInfo.document.type}, Approuvé le: ${urbanismeInfo.document.dateApprobation}`);
      }
      
      console.log(`   Nombre de zonages: ${urbanismeInfo.zonages.length}`);
      if (urbanismeInfo.zonages.length > 0) {
        console.log(`   Premier zonage: ${urbanismeInfo.zonages[0].libelle} - ${urbanismeInfo.zonages[0].description}`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API Urbanisme:', error.message);
    if (error.response) {
      console.error('   Réponse d\'erreur:', error.response.data);
    }
  }
}

async function testAdminSettingsAPI() {
  console.log('\nTest de l\'API Admin Settings...');
  
  try {
    // Test de récupération des configurations
    const configsResponse = await axios.get(`${API_URL}/admin/settings/external-sources`);
    
    console.log('✅ Récupération des configurations:', 
      configsResponse.data.success ? 'Succès' : 'Échec');
    
    if (configsResponse.data.success) {
      const configs = configsResponse.data.data;
      console.log('   Services configurés:');
      Object.keys(configs).forEach(key => {
        console.log(`     - ${configs[key].name}: ${configs[key].status}`);
      });
    }
    
    // Test de mise à jour du statut d'un service
    const statusResponse = await axios.post(`${API_URL}/admin/settings/external-sources/cadastre/status`, {
      status: 'ONLINE'
    });
    
    console.log('✅ Mise à jour du statut:', 
      statusResponse.data.success ? 'Succès' : 'Échec');
    
    // Test de récupération des statistiques
    const statsResponse = await axios.get(`${API_URL}/admin/settings/external-sources/cadastre/stats`);
    
    console.log('✅ Récupération des statistiques:', 
      statsResponse.data.success ? 'Succès' : 'Échec');
    
    if (statsResponse.data.success) {
      const stats = statsResponse.data.data;
      console.log(`   Utilisations: ${stats.usageCount}, Erreurs: ${stats.errorCount}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API Admin Settings:', error.message);
    if (error.response) {
      console.error('   Réponse d\'erreur:', error.response.data);
    }
  }
}

async function runTests() {
  console.log('=== TESTS DES API URBANISME ET CADASTRE ===\n');
  
  await testCadastreAPI();
  await testUrbanismeAPI();
  await testAdminSettingsAPI();
  
  console.log('\n=== FIN DES TESTS ===');
}

// Exécution des tests
runTests();