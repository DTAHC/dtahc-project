'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import ClientOnlyIcon from '../ui/ClientOnlyIcon';

type HeaderProps = {
  user?: {
    name: string;
    initials: string;
    notificationsCount?: number;
  };
};

export default function Header({ 
  user = { 
    name: 'Admin DTAHC', 
    initials: 'AD',
    notificationsCount: 3
  } 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <span className="font-bold text-xl text-gray-800">DTAHC</span>
          <span className="ml-2 text-gray-600">Gestion</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <ClientOnlyIcon icon={<Bell size={20} className="text-gray-400" />} />
          {user.notificationsCount && user.notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {user.notificationsCount > 9 ? '9+' : user.notificationsCount}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">{user.name}</span>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
}