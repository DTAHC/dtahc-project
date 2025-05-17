'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ComptablePage() {
  return (
    <DashboardLayout activeMenu="comptable">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion Comptable</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg mb-4">
            Module de gestion comptable - Version simplifiée
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="font-semibold mb-2">Factures</h3>
              <p className="text-xl font-bold">12</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="font-semibold mb-2">Paiements reçus</h3>
              <p className="text-xl font-bold">8 550,00 €</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <h3 className="font-semibold mb-2">Paiements en attente</h3>
              <p className="text-xl font-bold">3 200,00 €</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Référence</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Client</th>
                  <th className="py-2 px-4 border-b text-left">Montant</th>
                  <th className="py-2 px-4 border-b text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">FAC-2023-001</td>
                  <td className="py-2 px-4 border-b">15/10/2023</td>
                  <td className="py-2 px-4 border-b">Dupont Jean</td>
                  <td className="py-2 px-4 border-b">1 250,00 €</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Payée</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">FAC-2023-002</td>
                  <td className="py-2 px-4 border-b">02/11/2023</td>
                  <td className="py-2 px-4 border-b">Martin Sophie</td>
                  <td className="py-2 px-4 border-b">850,50 €</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">En attente</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">DEV-2023-003</td>
                  <td className="py-2 px-4 border-b">10/11/2023</td>
                  <td className="py-2 px-4 border-b">Bernard Thomas</td>
                  <td className="py-2 px-4 border-b">2 100,00 €</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Devis</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}