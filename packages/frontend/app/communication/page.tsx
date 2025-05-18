'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function CommunicationPage() {
  return (
    <DashboardLayout activeMenu="communication">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Modèles de Communication</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">Cette section vous permet de gérer les modèles de communication utilisés dans l'application.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Modèles d'emails</h3>
              <p className="text-sm text-gray-600 mt-1">Créer et modifier les modèles d'emails</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Modèles de documents</h3>
              <p className="text-sm text-gray-600 mt-1">Gérer les modèles de documents officiels</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Historique des envois</h3>
              <p className="text-sm text-gray-600 mt-1">Consulter l'historique des communications</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}