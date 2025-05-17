// app.js
/**
 * Application principale pour l'intégration de l'API Carto
 * Ce fichier montre comment utiliser les différents services
 * pour récupérer et afficher les informations cadastrales et réglementaires
 */

// Import des services
const CadastreService = require('./cadastre-service');
const CadastreMapService = require('./cadastre-map-service');
const UrbanismeService = require('./urbanisme-service');

// Import des modules utilitaires
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const turf = require('@turf/turf');

// Initialisation des services
const cadastreService = new CadastreService();
const cadastreMapService = new CadastreMapService();
const urbanismeService = new UrbanismeService();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de l'application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes de l'API

/**
 * Route pour rechercher une parcelle par adresse
 * POST /api/parcelle/search-by-address
 * Body: { address: "123 rue Example, 75001 Paris" }
 */
app.post('/api/parcelle/search-by-address', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Adresse non fournie' });
    }
    
    // 1. Geocodage de l'adresse pour obtenir les coordonnées
    // Note: Utilise un service de géocodage externe comme l'API Adresse
    const geocodeResponse = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
    
    if (!geocodeResponse.data.features || geocodeResponse.data.features.length === 0) {
      return res.status(404).json({ error: 'Adresse non trouvée' });
    }
    
    const coordinates = geocodeResponse.data.features[0].geometry.coordinates;
    
    // 2. Recherche de la parcelle à ces coordonnées
    const parcelleData = await cadastreService.getParcelleByCoordinates(coordinates[0], coordinates[1]);
    
    if (!parcelleData || parcelleData.totalFeatures === 0) {
      return res.status(404).json({ error: 'Aucune parcelle trouvée à cette adresse' });
    }
    
    // 3. Extraction des informations principales de la parcelle
    const parcelleInfo = cadastreService.extractParcelleInfo(parcelleData);
    
    // 4. Renvoi des informations
    res.json({
      success: true,
      data: parcelleInfo
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de parcelle par adresse :', error.message);
    res.status(500).json({ error: 'Erreur serveur', message: error.message });
  }
});

/**
 * Route pour rechercher une parcelle par références cadastrales
 * POST /api/parcelle/search-by-references
 * Body: { codeInsee: "94067", section: "AB", numero: "0123" }
 */
app.post('/api/parcelle/search-by-references', async (req, res) => {
  try {
    const { codeInsee, section, numero } = req.body;
    
    if (!codeInsee || !section || !numero) {
      return res.status(400).json({ error: 'Références cadastrales incomplètes' });
    }
    
    // 1. Recherche de la parcelle avec les références
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData || parcelleData.totalFeatures === 0) {
      return res.status(404).json({ error: 'Parcelle non trouvée avec ces références' });
    }
    
    // 2. Extraction des informations principales de la parcelle
    const parcelleInfo = cadastreService.extractParcelleInfo(parcelleData);
    
    // 3. Renvoi des informations
    res.json({
      success: true,
      data: parcelleInfo
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de parcelle par références :', error.message);
    res.status(500).json({ error: 'Erreur serveur', message: error.message });
  }
});

/**
 * Route pour générer des plans cadastraux
 * POST /api/parcelle/generate-maps
 * Body: { codeInsee: "94067", section: "AB", numero: "0123" }
 */
app.post('/api/parcelle/generate-maps', async (req, res) => {
  try {
    const { codeInsee, section, numero } = req.body;
    
    if (!codeInsee || !section || !numero) {
      return res.status(400).json({ error: 'Références cadastrales incomplètes' });
    }
    
    // 1. Recherche de la parcelle avec les références
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData || parcelleData.totalFeatures === 0) {
      return res.status(404).json({ error: 'Parcelle non trouvée avec ces références' });
    }
    
    // 2. Génération des paramètres pour les cartes
    const map500Params = cadastreMapService.generateMap500Parameters(parcelleData);
    const map3500Params = cadastreMapService.generateMap3500Parameters(parcelleData);
    
    // 3. Génération des HTML pour les cartes
    const map500HTML = cadastreMapService.generateLeafletMapHTML(map500Params);
    const map3500HTML = cadastreMapService.generateLeafletMapHTML(map3500Params);
    
    // 4. Création des fichiers HTML dans le dossier public
    const outputDir = path.join(__dirname, 'public', 'maps');
    
    // Création du dossier s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename500 = `plan_500_${codeInsee}_${section}_${numero}.html`;
    const filename3500 = `plan_3500_${codeInsee}_${section}_${numero}.html`;
    
    fs.writeFileSync(path.join(outputDir, filename500), map500HTML);
    fs.writeFileSync(path.join(outputDir, filename3500), map3500HTML);
    
    // 5. Renvoi des URLs des cartes
    res.json({
      success: true,
      maps: {
        map500: `/maps/${filename500}`,
        map3500: `/maps/${filename3500}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération des plans :', error.message);
    res.status(500).json({ error: 'Erreur serveur', message: error.message });
  }
});

/**
 * Route pour obtenir les informations d'urbanisme
 * POST /api/parcelle/urbanisme
 * Body: { codeInsee: "94067", section: "AB", numero: "0123" }
 */
app.post('/api/parcelle/urbanisme', async (req, res) => {
  try {
    const { codeInsee, section, numero } = req.body;
    
    if (!codeInsee || !section || !numero) {
      return res.status(400).json({ error: 'Références cadastrales incomplètes' });
    }
    
    // 1. Recherche de la parcelle avec les références
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData || parcelleData.totalFeatures === 0) {
      return res.status(404).json({ error: 'Parcelle non trouvée avec ces références' });
    }
    
    // 2. Récupération de la géométrie de la parcelle
    const parcelleGeometry = parcelleData.features[0].geometry;
    
    // 3. Récupération des informations d'urbanisme
    const urbanismeInfo = await urbanismeService.getCompleteUrbanismeInfo(parcelleGeometry);
    
    // 4. Renvoi des informations
    res.json({
      success: true,
      data: urbanismeInfo
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations d\'urbanisme :', error.message);
    res.status(500).json({ error: 'Erreur serveur', message: error.message });
  }
});

/**
 * Route pour obtenir un rapport complet (parcelle, plans, urbanisme)
 * POST /api/parcelle/rapport-complet
 * Body: { codeInsee: "94067", section: "AB", numero: "0123" }
 */
app.post('/api/parcelle/rapport-complet', async (req, res) => {
  try {
    const { codeInsee, section, numero } = req.body;
    
    if (!codeInsee || !section || !numero) {
      return res.status(400).json({ error: 'Références cadastrales incomplètes' });
    }
    
    // 1. Recherche de la parcelle avec les références
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData || parcelleData.totalFeatures === 0) {
      return res.status(404).json({ error: 'Parcelle non trouvée avec ces références' });
    }
    
    // 2. Extraction des informations principales de la parcelle
    const parcelleInfo = cadastreService.extractParcelleInfo(parcelleData);
    
    // 3. Génération des paramètres pour les cartes
    const map500Params = cadastreMapService.generateMap500Parameters(parcelleData);
    const map3500Params = cadastreMapService.generateMap3500Parameters(parcelleData);
    
    // 4. Génération des HTML pour les cartes
    const map500HTML = cadastreMapService.generateLeafletMapHTML(map500Params);
    const map3500HTML = cadastreMapService.generateLeafletMapHTML(map3500Params);
    
    // 5. Création des fichiers HTML dans le dossier public
    const outputDir = path.join(__dirname, 'public', 'maps');
    
    // Création du dossier s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename500 = `plan_500_${codeInsee}_${section}_${numero}.html`;
    const filename3500 = `plan_3500_${codeInsee}_${section}_${numero}.html`;
    
    fs.writeFileSync(path.join(outputDir, filename500), map500HTML);
    fs.writeFileSync(path.join(outputDir, filename3500), map3500HTML);
    
    // 6. Récupération des informations d'urbanisme
    const urbanismeInfo = await urbanismeService.getCompleteUrbanismeInfo(parcelleData.features[0].geometry);
    
    // 7. Renvoi du rapport complet
    res.json({
      success: true,
      parcelle: parcelleInfo,
      maps: {
        map500: `/maps/${filename500}`,
        map3500: `/maps/${filename3500}`
      },
      urbanisme: urbanismeInfo
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport complet :', error.message);
    res.status(500).json({ error: 'Erreur serveur', message: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Interface accessible à l'adresse: http://localhost:${PORT}`);
});

module.exports = app;
