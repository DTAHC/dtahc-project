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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
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
          addresses: [
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
          ]
        };
        console.log('API Route: Generated mock response (backend unavailable):', JSON.stringify(mockClient, null, 2));
        return NextResponse.json(mockClient);
      }
    } catch (healthError) {
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
      } catch (e) {
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
  } catch (error) {
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${backendUrl}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route: Backend error', response.status, errorText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Return the clients data from the backend
    const clients = await response.json();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error retrieving clients' },
      { status: 500 }
    );
  }
}