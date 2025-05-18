'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminPage() {
  return (
    <DashboardLayout activeMenu="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Administration</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">Cette section vous permet de gérer les paramètres administratifs de l'application.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Gestion des utilisateurs</h3>
              <p className="text-sm text-gray-600 mt-1">Ajouter, modifier ou supprimer des utilisateurs</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Rôles et permissions</h3>
              <p className="text-sm text-gray-600 mt-1">Configurer les accès et les droits des utilisateurs</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
              <h3 className="font-semibold text-blue-600">Paramètres système</h3>
              <p className="text-sm text-gray-600 mt-1">Configurer les paramètres globaux de l'application</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}