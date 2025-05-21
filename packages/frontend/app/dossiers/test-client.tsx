'use client';

import { useState, useEffect } from 'react';
import { useDossiers } from '../../hooks/useDossiers';
import { notifyDossierUpdate } from '../../utils/dossierEvents';

/**
 * Composant de test pour la synchronisation des dossiers
 * Ce composant permet de tester si notre solution fonctionne correctement
 */
export default function DossierSyncTester() {
  const { dossiers, loading, error, createDossier } = useDossiers();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failure'>('idle');
  
  // Ajouter un message au journal de test
  const logTest = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };
  
  // Fonction pour exécuter les tests
  const runTests = async () => {
    setTestStatus('running');
    setTestResults([]);
    logTest('Démarrage des tests de synchronisation...');
    
    try {
      // Test 1: Création d'un dossier et notification
      logTest('Test 1: Création d\'un dossier');
      const newDossier = {
        title: `Test Dossier ${Date.now()}`,
        clientId: 'mock-client-1',
        type: 'DP',
        description: 'Dossier créé pour tester la synchronisation',
        priority: 'NORMAL'
      };
      
      const createdDossier = await createDossier(newDossier);
      if (!createdDossier) {
        throw new Error('Échec de la création du dossier');
      }
      
      logTest(`Dossier créé avec ID: ${createdDossier.id}`);
      
      // Test 2: Simuler une notification de mise à jour
      logTest('Test 2: Émission d\'une notification manuelle');
      notifyDossierUpdate();
      logTest('Notification émise, vérifiez que les autres pages se mettent à jour');
      
      // Tests réussis
      logTest('Tous les tests ont réussi!');
      setTestStatus('success');
    } catch (err) {
      logTest(`ERREUR: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setTestStatus('failure');
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test de Synchronisation des Dossiers</h1>
      
      <div className="mb-6">
        <button 
          onClick={runTests}
          disabled={testStatus === 'running'}
          className={`px-4 py-2 rounded font-medium ${
            testStatus === 'idle' ? 'bg-blue-500 text-white' :
            testStatus === 'running' ? 'bg-yellow-500 text-white' :
            testStatus === 'success' ? 'bg-green-500 text-white' :
            'bg-red-500 text-white'
          }`}
        >
          {testStatus === 'idle' ? 'Lancer les tests' :
           testStatus === 'running' ? 'Tests en cours...' :
           testStatus === 'success' ? 'Tests réussis!' :
           'Tests échoués'}
        </button>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Journal des tests</h2>
        <div className="bg-black text-green-400 font-mono p-4 rounded max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">Aucun test exécuté</p>
          ) : (
            testResults.map((message, index) => (
              <div key={index} className="mb-1">
                {message}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Dossiers actuellement chargés</h2>
        {loading ? (
          <p className="text-gray-500">Chargement des dossiers...</p>
        ) : error ? (
          <p className="text-red-500">Erreur: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossiers.map(dossier => (
              <div key={dossier.id} className="border rounded-lg p-4 bg-white">
                <p className="font-semibold">{dossier.title || 'Sans titre'}</p>
                <p className="text-sm text-gray-600">{dossier.reference || dossier.id}</p>
                <p className="text-sm text-gray-500 mt-1">{dossier.type} | {dossier.status || 'Statut inconnu'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}