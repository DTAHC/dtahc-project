import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to get a client by ID - returning mock response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API Route: Handling client retrieval request for ID ${params.id} with mock response`);
    
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
    
    // If not a mock ID, try reaching the backend (commented out for now)
    /*
    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${backendUrl}/clients/${params.id}`, {
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
    
    // Return the client data from the backend
    const client = await response.json();
    return NextResponse.json(client);
    */
    
    // For non-mock IDs, return a notFound response for now
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Route: Unexpected error', error);
    return NextResponse.json(
      { error: 'Unexpected error retrieving client' },
      { status: 500 }
    );
  }
}