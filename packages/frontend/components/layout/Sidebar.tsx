"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  Database,
  Mail,
  FolderOpen,
  Plus,
  MapPin
} from 'lucide-react';
import ClientOnlyIcon from '../ui/ClientOnlyIcon';

type SidebarProps = {
  activeMenu?: string;
};

export default function Sidebar({ activeMenu = 'dashboard' }: SidebarProps) {
  const pathname = usePathname();
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen">
      <nav className="p-4">
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<BarChart2 size={20} className="mr-3" />} 
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Tableau de Bord</span>
          </Link>
          
          <Link 
            href="/clients" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/clients') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<Users size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Clients</span>
          </Link>
          
          <Link 
            href="/dossiers" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/dossiers') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<FolderOpen size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Dossiers</span>
          </Link>
          
          <Link 
            href="/comptable" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/comptable') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<Database size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Gestion Comptable</span>
          </Link>
          
          <Link 
            href="/admin" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<Settings size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Administration</span>
          </Link>
          
          <Link 
            href="/emails" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/emails') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<Mail size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Emails</span>
          </Link>

          <Link 
            href="/urbanisme" 
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
              isActive('/urbanisme') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClientOnlyIcon 
              icon={<MapPin size={20} className="mr-3" />}
              fallback={<div className="w-5 h-5 mr-3" />}
            />
            <span className="font-medium">Règles urbanisme</span>
          </Link>
        </div>
        
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Accès rapide
          </h3>
          <div className="mt-2 space-y-1">
            <Link href="/clients/new" className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <ClientOnlyIcon 
                icon={<Plus size={16} className="mr-2 text-gray-500" />}
                fallback={<div className="w-4 h-4 mr-2" />}
              />
              Nouveau client
            </Link>
            <Link href="/dossiers/new" className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <ClientOnlyIcon 
                icon={<FileText size={16} className="mr-2 text-gray-500" />}
                fallback={<div className="w-4 h-4 mr-2" />}
              />
              Nouveau dossier
            </Link>
            <Link href="/dossiers?status=NOUVEAU" className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <ClientOnlyIcon 
                icon={<AlertCircle size={16} className="mr-2 text-gray-500" />}
                fallback={<div className="w-4 h-4 mr-2" />}
              />
              Dossiers nouveaux
            </Link>
            <Link href="/dossiers?priority=URGENT" className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <ClientOnlyIcon 
                icon={<Clock size={16} className="mr-2 text-gray-500" />}
                fallback={<div className="w-4 h-4 mr-2" />}
              />
              Dossiers urgents
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}