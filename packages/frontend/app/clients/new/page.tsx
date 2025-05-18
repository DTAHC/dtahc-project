'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientForm } from '@/components/clients/ClientForm';
import { CreateClientDto } from '@dtahc/shared';

export default function NewClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateClientDto) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      const client = await response.json();
      router.push(`/clients/${client.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nouveau client</h1>
        <p className="text-gray-600">Créez un nouveau client en remplissant le formulaire ci-dessous.</p>
      </div>

      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}