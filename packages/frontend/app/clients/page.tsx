'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ClientsPage() {
  return (
    <DashboardLayout activeMenu="clients">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Clients</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">Cette section vous permet de gérer les clients de l'application.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Nouveaux clients</h3>
              <p className="text-sm text-gray-600 mt-1">Ajouter un nouveau client dans le système</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Recherche clients</h3>
              <p className="text-sm text-gray-600 mt-1">Rechercher et filtrer la liste des clients</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Rapports clients</h3>
              <p className="text-sm text-gray-600 mt-1">Générer des rapports sur l'activité client</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}