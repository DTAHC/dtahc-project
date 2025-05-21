import { Suspense } from 'react';
import DossierSyncTester from '../test-client';

export const metadata = {
  title: 'Test de Synchronisation des Dossiers',
  description: 'Page de test pour vérifier la synchronisation des dossiers entre les différentes pages'
};

export default function DossierTestPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Chargement...</div>}>
        <DossierSyncTester />
      </Suspense>
    </div>
  );
}