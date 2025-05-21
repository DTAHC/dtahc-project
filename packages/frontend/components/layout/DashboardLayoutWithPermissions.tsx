import React from 'react';
import Header from './Header';
import SidebarWithPermissions from './SidebarWithPermissions';

type DashboardLayoutWithPermissionsProps = {
  children: React.ReactNode;
  activeMenu?: string;
};

export default function DashboardLayoutWithPermissions({ 
  children, 
  activeMenu = 'dashboard'
}: DashboardLayoutWithPermissionsProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar avec gestion des permissions */}
        <SidebarWithPermissions activeMenu={activeMenu} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}