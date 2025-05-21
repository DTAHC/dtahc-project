import React, { memo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import HydrationFix from '../ui/HydrationFix';

type DashboardLayoutProps = {
  children: React.ReactNode;
  activeMenu?: string;
};

function DashboardLayout({ 
  children, 
  activeMenu = 'dashboard'
}: DashboardLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Script de correction d'hydratation */}
      <HydrationFix />
      
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Optimisation pour éviter les rendus inutiles
export default memo(DashboardLayout);
