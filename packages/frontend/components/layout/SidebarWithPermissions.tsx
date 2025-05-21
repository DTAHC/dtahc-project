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
  Settings,
  Database,
  Mail,
  FolderOpen,
  Plus,
  MapPin,
  UserPlus,
  LogOut,
  Shield
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

type SidebarProps = {
  activeMenu?: string;
};

export default function SidebarWithPermissions({ activeMenu = 'dashboard' }: SidebarProps) {
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuth();
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  // Fonction pour vérifier si l'utilisateur a accès à un élément du menu
  const hasAccess = (permissions: string[], anyPermission = true) => {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;
    
    return anyPermission
      ? permissions.some(permission => hasPermission(permission))
      : permissions.every(permission => hasPermission(permission));
  };

  const handleLogout = async () => {
    await logout();
  };

  // Structure des éléments du menu avec leurs permissions
  const menuItems = [
    {
      href: "/dashboard",
      text: "Tableau de Bord",
      icon: <BarChart2 size={20} className="mr-3" />,
      permissions: ['dashboard_full_access', 'dashboard_restricted_access'],
      anyPermission: true
    },
    {
      href: "/clients",
      text: "Clients",
      icon: <Users size={20} className="mr-3" />,
      permissions: ['clients_full_access', 'clients_restricted_access'],
      anyPermission: true
    },
    {
      href: "/dossiers",
      text: "Dossiers",
      icon: <FolderOpen size={20} className="mr-3" />,
      permissions: ['dashboard_full_access', 'dashboard_restricted_access'],
      anyPermission: true
    },
    {
      href: "/comptable",
      text: "Gestion Comptable",
      icon: <Database size={20} className="mr-3" />,
      permissions: ['accounting_full_access', 'accounting_restricted_access'],
      anyPermission: true
    },
    {
      href: "/admin",
      text: "Administration",
      icon: <Settings size={20} className="mr-3" />,
      permissions: ['admin_manage_users', 'admin_system_settings', 'admin_advanced_config', 'admin_manage_roles'],
      anyPermission: true
    },
    {
      href: "/emails",
      text: "Emails",
      icon: <Mail size={20} className="mr-3" />,
      permissions: []
    },
    {
      href: "/urbanisme",
      text: "Règles urbanisme",
      icon: <MapPin size={20} className="mr-3" />,
      permissions: ['cadastre_access', 'plu_analysis']
    }
  ];

  // Structure des éléments du menu d'accès rapide
  const quickAccessItems = [
    {
      href: "/clients/new",
      text: "Nouveau client",
      icon: <Plus size={16} className="mr-2 text-gray-500" />,
      permissions: ['clients_create']
    },
    {
      href: "/dossiers/new",
      text: "Nouveau dossier",
      icon: <FileText size={16} className="mr-2 text-gray-500" />,
      permissions: ['dashboard_create_dossier']
    },
    {
      href: "/dossiers?status=NOUVEAU",
      text: "Dossiers nouveaux",
      icon: <AlertCircle size={16} className="mr-2 text-gray-500" />,
      permissions: ['dashboard_view_dossier']
    },
    {
      href: "/dossiers?priority=URGENT",
      text: "Dossiers urgents",
      icon: <Clock size={16} className="mr-2 text-gray-500" />,
      permissions: ['dashboard_view_dossier']
    },
    {
      href: "/admin/users",
      text: "Gestion utilisateurs",
      icon: <UserPlus size={16} className="mr-2 text-gray-500" />,
      permissions: ['admin_manage_users']
    },
    {
      href: "/admin/roles",
      text: "Rôles et permissions",
      icon: <Shield size={16} className="mr-2 text-gray-500" />,
      permissions: ['admin_manage_roles']
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      {/* En-tête avec logo et infos utilisateur */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-blue-600 h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold mr-3">
            D
          </div>
          <div>
            <h1 className="text-lg font-semibold">DTAHC</h1>
            <p className="text-xs text-gray-500">Gestion des autorisations</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center mt-2 pb-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Menu principal */}
      <nav className="flex-grow p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            hasAccess(item.permissions, item.anyPermission) && (
              <Link 
                key={index}
                href={item.href} 
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </Link>
            )
          ))}
        </div>
        
        {/* Accès rapide */}
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Accès rapide
          </h3>
          <div className="mt-2 space-y-1">
            {quickAccessItems.map((item, index) => (
              hasAccess(item.permissions) && (
                <Link 
                  key={index}
                  href={item.href} 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  {item.icon}
                  {item.text}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>
      
      {/* Bouton déconnexion */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          <LogOut size={16} className="mr-2 text-gray-500" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}