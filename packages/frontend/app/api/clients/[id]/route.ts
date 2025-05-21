import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to get a client by ID - with backend integration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API Route: Handling client retrieval request for ID ${params.id}`);
    
    // LocalStorage ne peut pas être utilisé directement dans l'API route
    // car nous sommes côté serveur, pas dans le navigateur!
    // Ce code est conservé pour référence mais ne s'exécutera jamais.
    
    // Le code suivant est côté serveur et doit utiliser les APIs Next.js
    
    // Check if this is a mock ID
    if (params.id.startsWith('mock-')) {
      // Return a mock client based on the ID
      const mockClient = {
        id: params.id,
        reference: 'CL-2025-MOCK',
        clientType: 'PARTICULIER',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '0123456789',
        proReferenceId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: '89aa20af-7cb2-4792-8f98-ad0428124aa9',
        contactInfo: {
          id: 'mock-contact-123',
          clientId: params.id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '0123456789',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        addresses: [
          {
            id: 'mock-address-123',
            clientId: params.id,
            type: 'POSTAL',
            street: '123 Main Street',
            city: 'Paris',
            postalCode: '75001',
            isProjectAddress: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ],
        dossiers: []
      };
      
      console.log('API Route: Generated mock client:', JSON.stringify(mockClient, null, 2));
      return NextResponse.json(mockClient);
    }
    
    // Try reaching the backend
    try {
      // Forward the request to the backend API
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${backendUrl}/clients/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      // Check if the response was successful
      if (response.ok) {
        const client = await response.json();
        console.log('API Route: Successfully retrieved client from backend');
        return NextResponse.json(client);
      }
      
      console.error(`API Route: Backend error ${response.status}`);
    } catch (backendError: any) {
      console.error('API Route: Backend connection error:', backendError);
    }
    
    // Récupérer les clients depuis l'API clients générale
    try {
      console.log('API Route: Trying to find client in all clients list');
      const allClientsResponse = await fetch(`${request.nextUrl.origin}/api/clients`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (allClientsResponse.ok) {
        const allClients = await allClientsResponse.json();
        console.log('API Route: Got all clients, searching for ID:', params.id);
        console.log('API Route: Available client IDs:', allClients.map((c: any) => c.id).join(', '));
        
        const foundClient = allClients.find((client: any) => client.id === params.id);
        
        if (foundClient) {
          console.log('API Route: Found client in all clients list:', foundClient);
          return NextResponse.json(foundClient);
        } else {
          console.log('API Route: Client not found in clients list, checking for client_prefix');
          // Check if the ID might be missing the "client_" prefix
          const cleanId = params.id.replace('client_', '');
          const withPrefixId = `client_${cleanId}`;
          const altClient = allClients.find((client: any) => 
            client.id === withPrefixId || client.id === cleanId
          );
          
          if (altClient) {
            console.log('API Route: Found client with alternative ID format:', altClient);
            return NextResponse.json(altClient);
          }
        }
      }
    } catch (listError: any) {
      console.error('API Route: Error fetching clients list:', listError);
    }
    
    // Si le client n'a pas été trouvé, renvoyer une erreur 404
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error retrieving client' },
      { status: 500 }
    );
  }
}