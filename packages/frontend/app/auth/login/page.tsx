'use client';

import LoginForm from '@/components/form/LoginForm';
import { Users, FileText, MapPin } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <LoginForm />
      
      <div className="mt-8 text-center">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Plateforme complète pour la gestion des autorisations d'urbanisme</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-2xl">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Gestion clients<br />centralisée</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Suivi complet<br />des dossiers</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Documents cadastraux<br />automatisés</p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-500">
        © 2025 DTAHC SARL. Tous droits réservés.
      </p>
    </div>
  );
}