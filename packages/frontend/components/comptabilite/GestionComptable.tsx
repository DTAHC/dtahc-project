'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FilePlus, FileText, FileCheck, FileX, Wallet, 
  Calendar, Euro, Search, Clock, AlertTriangle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const statusMap: Record<string, { color: string, icon: React.ReactNode, text: string }> = {
      'PAID': { color: 'bg-green-100 text-green-800', icon: <FileCheck size={16} />, text: 'Payée' },
      'PENDING': { color: 'bg-blue-100 text-blue-800', icon: <Clock size={16} />, text: 'En attente' },
      'PARTIAL': { color: 'bg-yellow-100 text-yellow-800', icon: <Wallet size={16} />, text: 'Partiel' },
      'CANCELLED': { color: 'bg-red-100 text-red-800', icon: <FileX size={16} />, text: 'Annulée' },
      'OVERDUE': { color: 'bg-orange-100 text-orange-800', icon: <AlertTriangle size={16} />, text: 'En retard' },
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: <FileText size={16} />, text: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="ml-1">{statusInfo.text}</span>
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string, text: string }> = {
      'FACTURE': { color: 'bg-indigo-100 text-indigo-800', text: 'Facture' },
      'DEVIS': { color: 'bg-purple-100 text-purple-800', text: 'Devis' },
      'ACOMPTE': { color: 'bg-pink-100 text-pink-800', text: 'Acompte' },
    };
    
    const typeInfo = typeMap[type] || { color: 'bg-gray-100 text-gray-800', text: type };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.text}
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
          <Button variant="default">
            <FilePlus size={16} className="mr-2" />
            Nouvelle Facture
          </Button>
          <Button variant="outline">
            <FilePlus size={16} className="mr-2" />
            Nouveau Devis
          </Button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PAID">Payées</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="PARTIAL">Paiement partiel</SelectItem>
              <SelectItem value="OVERDUE">En retard</SelectItem>
              <SelectItem value="CANCELLED">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents comptables</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Documents comptables</CardTitle>
              <CardDescription>
                Gérez vos factures, devis et acomptes
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                              <Button variant="ghost" size="icon">
                                <FileText size={16} />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Euro size={16} />
                              </Button>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paiements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>
                Suivi des paiements reçus et à percevoir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">
                  Module de paiements en développement
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistiques" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques financières</CardTitle>
              <CardDescription>
                Analyse de vos revenus et trésorerie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">
                  Module de statistiques en développement
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}