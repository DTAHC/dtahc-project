'use client';

import React from 'react';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import ClientOnlyIcon from '../ui/ClientOnlyIcon';
import Notifications from './Notifications';

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
        <Notifications />
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