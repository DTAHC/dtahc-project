'use client';

import React, { useState } from 'react';

export default function GestionComptable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données factices pour la démonstration
  const facturesMock = [
    { id: 'FAC-2023-001', client: 'Dupont Jean', montant: 1250.00, date: '2023-10-15', statut: 'PAID', type: 'FACTURE' },
    { id: 'FAC-2023-002', client: 'Martin Sophie', montant: 850.50, date: '2023-11-02', statut: 'PENDING', type: 'FACTURE' },
    { id: 'DEV-2023-003', client: 'Bernard Thomas', montant: 2100.00, date: '2023-11-10', statut: 'PENDING', type: 'DEVIS' },
    { id: 'FAC-2023-004', client: 'Petit Marie', montant: 970.25, date: '2023-10-25', statut: 'PARTIAL', type: 'FACTURE' },
    { id: 'DEV-2023-005', client: 'Dubois Pierre', montant: 1600.00, date: '2023-11-15', statut: 'CANCELLED', type: 'DEVIS' },
  ];

  const getStatusBadge = (status: string) => {
    const statusClasses: {[key: string]: string} = {
      'PAID': 'bg-green-100 text-green-800',
      'PENDING': 'bg-blue-100 text-blue-800',
      'PARTIAL': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'OVERDUE': 'bg-orange-100 text-orange-800',
    };
    
    const statusText: {[key: string]: string} = {
      'PAID': 'Payée',
      'PENDING': 'En attente',
      'PARTIAL': 'Partiel',
      'CANCELLED': 'Annulée',
      'OVERDUE': 'En retard',
    };
    
    const classes = statusClasses[status] || 'bg-gray-100 text-gray-800';
    const text = statusText[status] || status;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
        {text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClasses: {[key: string]: string} = {
      'FACTURE': 'bg-indigo-100 text-indigo-800',
      'DEVIS': 'bg-purple-100 text-purple-800',
      'ACOMPTE': 'bg-pink-100 text-pink-800',
    };
    
    const typeText: {[key: string]: string} = {
      'FACTURE': 'Facture',
      'DEVIS': 'Devis',
      'ACOMPTE': 'Acompte',
    };
    
    const classes = typeClasses[type] || 'bg-gray-100 text-gray-800';
    const text = typeText[type] || type;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
        {text}
      </span>
    );
  };

  const filteredDocuments = facturesMock.filter(doc => {
    const matchesSearch = doc.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <span className="mr-2">+</span>
            Nouvelle Facture
          </button>
          <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <span className="mr-2">+</span>
            Nouveau Devis
          </button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            className="w-[180px] h-10 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md"
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="PAID">Payées</option>
            <option value="PENDING">En attente</option>
            <option value="PARTIAL">Paiement partiel</option>
            <option value="OVERDUE">En retard</option>
            <option value="CANCELLED">Annulées</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className="px-4 py-3 border-b-2 border-blue-500 text-blue-600 font-medium">
              Documents comptables
            </button>
            <button className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300 font-medium">
              Paiements
            </button>
            <button className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300 font-medium">
              Statistiques
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Référence</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Client</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Montant</th>
                  <th scope="col" className="px-6 py-3">Statut</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{doc.id}</td>
                      <td className="px-6 py-4">{getTypeBadge(doc.type)}</td>
                      <td className="px-6 py-4">{doc.client}</td>
                      <td className="px-6 py-4">{new Date(doc.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{doc.montant.toFixed(2)} €</td>
                      <td className="px-6 py-4">{getStatusBadge(doc.statut)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b">
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Aucun document correspondant aux critères
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}