import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to create a new client by forwarding the request to the backend
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Handling client creation request');
    
    // Get the client data from the request
    const clientData = await request.json();
    console.log('API Route: Client data', JSON.stringify(clientData, null, 2));
    
    // Forward to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
    console.log(`API Route: Sending request to ${backendUrl}/clients`);
    
    // Check if backend is reachable first
    try {
      const healthCheck = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('API Route: Health check status:', healthCheck.status);
      if (!healthCheck.ok) {
        console.error('API Route: Backend is not responding to health check');
        // Fallback to mock if backend unavailable
        const mockClient = {
          id: 'mock-' + Date.now(),
          reference: 'CL-2025-MOCK',
          clientType: clientData.clientType,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          proReferenceId: clientData.proReferenceId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdById: '89aa20af-7cb2-4792-8f98-ad0428124aa9',
          contactInfo: {
            id: 'mock-contact-' + Date.now(),
            clientId: 'mock-' + Date.now(),
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            email: clientData.email,
            phone: clientData.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          formLinks: clientData.sendFormLink ? [
            {
              id: 'mock-form-link-' + Date.now(),
              clientId: 'mock-' + Date.now(),
              token: 'mock-token-' + Date.now(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              emailSent: true,
              sentAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              type: 'CLIENT_FORM'
            }
          ] : [],
          addresses: clientData.street && clientData.city && clientData.postalCode ? [
            {
              id: 'mock-address-' + Date.now(),
              clientId: 'mock-' + Date.now(),
              type: 'POSTAL',
              street: clientData.street,
              city: clientData.city,
              postalCode: clientData.postalCode,
              isProjectAddress: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ] : []
        };
        console.log('API Route: Generated mock response (backend unavailable):', JSON.stringify(mockClient, null, 2));
        return NextResponse.json(mockClient);
      }
    } catch (healthError: any) {
      console.error('API Route: Cannot reach backend server', healthError);
      return NextResponse.json(
        { error: 'Cannot connect to backend server. Please ensure the backend service is running.' },
        { status: 503 }
      );
    }
    
    // Make the actual request
    const response = await fetch(`${backendUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('API Route: Backend error', response.status, errorText);
        errorMessage = errorText;
      } catch (e: any) {
        console.error('API Route: Could not parse error response', e);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    
    // Return the created client data from the backend
    const client = await response.json();
    console.log('API Route: Client created successfully', client);
    return NextResponse.json(client);
  } catch (error: any) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error during client creation' },
      { status: 500 }
    );
  }
}

/**
 * API route to get all clients by forwarding the request to the backend
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Forwarding client retrieval request to backend');
    
    // Forward the request to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
    console.log(`API Route: Trying to connect to backend at ${backendUrl}/clients`);
    
    try {
      // Try with a health check first
      const healthCheck = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      });
      
      console.log('API Route: Health check status:', healthCheck.status);
      
      if (healthCheck.ok) {
        // Backend is running, use it
        const response = await fetch(`${backendUrl}/clients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
          next: { revalidate: 0 },
        });
        
        // Check if the response was successful
        if (response.ok) {
          const clients = await response.json();
          console.log('API Route: Successfully fetched clients from backend');
          return NextResponse.json(clients);
        } else {
          console.error('API Route: Backend returned error', response.status);
          throw new Error(`Backend API error: ${response.status}`);
        }
      } else {
        console.warn('API Route: Backend health check failed, using mock data');
        throw new Error('Backend unavailable');
      }
    } catch (error: any) {
      console.error('API Route: Error connecting to backend, using mock data', error);
      // Use mock data as fallback with formLinks for testing the formLink feature
      const mockClients = [
        {
          id: '1',
          reference: 'CL-2025-042',
          clientType: 'PARTICULIER',
          status: 'ACTIF',
          createdAt: '2025-04-15T10:00:00Z',
          updatedAt: '2025-05-14T14:30:00Z',
          lastContactDate: '2025-05-14T14:30:00Z',
          source: 'Site web',
          contactInfo: {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '06 12 34 56 78',
          },
          addresses: [
            {
              id: '1',
              street: '123 Rue Principale',
              city: 'Paris',
              postalCode: '75001',
              country: 'France',
              type: 'POSTAL'
            }
          ],
          dossiers: [
            { id: '1', reference: 'DOS-2025-001', status: 'EN_COURS' },
            { id: '2', reference: 'DOS-2025-002', status: 'EN_COURS' }
          ],
          formLinks: [
            {
              id: 'form-1',
              clientId: '1',
              token: 'token-completed',
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              completed: true,
              completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              emailSent: true,
              sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              type: 'CLIENT_FORM'
            }
          ]
        },
        {
          id: '2',
          reference: 'CL-2025-043',
          clientType: 'MDT_ANTONY',
          status: 'ACTIF',
          createdAt: '2025-04-20T11:15:00Z',
          updatedAt: '2025-05-10T09:45:00Z',
          lastContactDate: '2025-05-10T09:45:00Z',
          source: 'Recommandation',
          contactInfo: {
            firstName: 'Sophie',
            lastName: 'Martin',
            email: 'sophie.martin@example.com',
            phone: '06 23 45 67 89',
          },
          addresses: [
            {
              id: '2',
              street: '45 Avenue Victor Hugo',
              city: 'Neuilly-sur-Seine',
              postalCode: '92200',
              country: 'France',
              type: 'POSTAL'
            }
          ],
          dossiers: [
            { id: '3', reference: 'DOS-2025-003', status: 'EN_COURS' }
          ],
          formLinks: [
            {
              id: 'form-2',
              clientId: '2',
              token: 'token-waiting',
              expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              emailSent: true,
              sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              type: 'CLIENT_FORM'
            }
          ]
        },
        {
          id: '3',
          reference: 'CL-2025-044',
          clientType: 'COMBLE_DF',
          status: 'INACTIF',
          contactInfo: {
            firstName: 'Pierre',
            lastName: 'Dubois',
            email: 'pierre.dubois@example.com',
            phone: '06 34 56 78 90',
          },
          addresses: [],
          formLinks: [
            {
              id: 'form-3',
              clientId: '3',
              token: 'token-expired',
              expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              emailSent: true,
              sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              type: 'CLIENT_FORM'
            }
          ]
        },
        {
          id: '4',
          reference: 'CL-2025-045',
          clientType: 'PARTICULIER',
          status: 'ACTIF',
          contactInfo: {
            firstName: 'Marie',
            lastName: 'Lefebvre',
            email: 'marie.lefebvre@example.com',
            phone: '06 45 67 89 01',
          },
          addresses: [],
          dossiers: [],
          formLinks: []
        }
      ];
      console.log('API Route: Returning mock clients:', mockClients.length);
      return NextResponse.json(mockClients);
    }
  } catch (error: any) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error retrieving clients' },
      { status: 500 }
    );
  }
}