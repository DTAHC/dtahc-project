'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import GestionComptable from '@/components/comptabilite/GestionComptable';

export default function ComptablePage() {
  return (
    <DashboardLayout activeMenu="comptable">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion Comptable</h1>
        <GestionComptable />
      </div>
    </DashboardLayout>
  );
}