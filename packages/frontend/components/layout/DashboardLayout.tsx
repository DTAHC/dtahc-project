import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  activeMenu?: string;
};

export default function DashboardLayout({ 
  children, 
  activeMenu = 'dashboard'
}: DashboardLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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