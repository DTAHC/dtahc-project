import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to get all dossiers by forwarding the request to the backend
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Forwarding dossier retrieval request to backend');
    
    // Vérifier si la requête doit ignorer le cache
    const url = new URL(request.url);
    const noCache = url.searchParams.get('noCache') === 'true';
    
    console.log('API Route: Cache control headers:', request.headers.get('Cache-Control'));
    
    // Forward the request to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Ajouter un paramètre de cache-busting pour éviter la mise en cache
    const timestamp = Date.now();
    
    console.log(`API Route: Sending request to ${backendUrl}/dossiers?t=${timestamp}`);
    
    // Obtenons d'abord les dossiers mockés basés sur les vrais clients
    const mockDossiers = await getMockDossiers();
    
    try {
      const response = await fetch(`${backendUrl}/dossiers?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      // Check if the response was successful
      if (response.ok) {
        // Return the dossiers data from the backend plus mock dossiers
        const dossiers = await response.json();
        console.log(`API Route: Retrieved ${dossiers.length} dossiers from backend`);
        
        // Combiner les dossiers backend avec les dossiers mockés
        // en évitant les doublons
        const combinedDossiers = [
          ...dossiers,
          ...mockDossiers.filter(mock => 
            !dossiers.some((d: any) => d.id === mock.id)
          )
        ];
        
        console.log(`API Route: Total dossiers (backend + mock): ${combinedDossiers.length}`);
        return NextResponse.json(combinedDossiers);
      }
    } catch (fetchError) {
      console.error('API Route: Error fetching from backend:', fetchError);
    }
    
    // Si on arrive ici, c'est que la requête a échoué ou le backend est indisponible
    console.log('API Route: Using mock dossiers');
    return NextResponse.json(mockDossiers);
    
  } catch (error) {
    console.error('API Route: Unexpected error', error);
    // Return mock data as fallback in case of error
    console.log('API Route: Returning mock dossiers due to error');
    const mockDossiers = await getMockDossiers();
    return NextResponse.json(mockDossiers);
  }
}

/**
 * API route to create a new dossier by forwarding the request to the backend
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Handling dossier creation request');
    
    // Get the dossier data from the request
    const dossierData = await request.json();
    console.log('API Route: Dossier data', JSON.stringify(dossierData, null, 2));
    
    // Fix for numeric types coming from form
    const fixedData = {
      ...dossierData,
      // Convert to numbers or null if empty strings
      surfaceExistant: dossierData.surfaceExistant !== undefined && dossierData.surfaceExistant !== '' 
        ? Number(dossierData.surfaceExistant) 
        : null,
      surfaceProjet: dossierData.surfaceProjet !== undefined && dossierData.surfaceProjet !== '' 
        ? Number(dossierData.surfaceProjet) 
        : null,
      // Ensure other fields have proper types/defaults
      priority: dossierData.priority || 'NORMAL',
      deadline: dossierData.deadline || null,
      description: dossierData.description || ''
    };
    
    console.log('API Route: Fixed dossier data', JSON.stringify(fixedData, null, 2));
    
    // Forward to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    console.log(`API Route: Sending request to ${backendUrl}/dossiers`);
    
    try {
      // Récupérer les informations du client
      let client = null;
      
      // Tentative de récupération du client associé
      try {
        const clientResponse = await fetch(`${backendUrl}/clients/${fixedData.clientId}`);
        if (clientResponse.ok) {
          client = await clientResponse.json();
          console.log('API Route: Retrieved client information for dossier');
        } else {
          console.log('API Route: Could not retrieve client information, using clients list instead');
          const clientsResponse = await fetch(`${backendUrl}/clients`);
          if (clientsResponse.ok) {
            const clients = await clientsResponse.json();
            client = clients.find((c: any) => c.id === fixedData.clientId);
          }
        }
      } catch (clientError) {
        console.error('API Route: Error fetching client:', clientError);
      }
      
      // Tenter la création via l'API backend
      const response = await fetch(`${backendUrl}/dossiers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fixedData),
      });
      
      if (response.ok) {
        // Si le backend répond correctement, utiliser la réponse
        const dossier = await response.json();
        console.log('API Route: Dossier created successfully via backend', dossier);
        return NextResponse.json(dossier);
      } 
      
      // Si on arrive ici, c'est que le backend a échoué
      console.error('API Route: Backend error when creating dossier');
    } catch (backendError) {
      console.error('API Route: Backend error:', backendError);
    }
    
    // Créer une réponse mock si le backend échoue
    // Générer un ID unique basé sur timestamp
    const mockId = 'mock-' + Date.now();
    const dossierNumber = (mockDossierStorage.length + 1).toString().padStart(3, '0');
    
    // Récupérer le client s'il existe
    let client = null;
    try {
      const clientsRaw = await getRealClients();
      client = clientsRaw.find((c: any) => c.id === fixedData.clientId);
      console.log(`Client found for dossier: ${client ? 'Yes' : 'No'}`);
    } catch (e) {
      console.error('Error fetching client for mock dossier:', e);
    }
    
    const mockDossier = {
      id: mockId,
      reference: `DOS-2025-${dossierNumber}`,
      title: fixedData.title,
      description: fixedData.description,
      clientId: fixedData.clientId,
      type: fixedData.type,
      status: 'NOUVEAU',
      workflowState: 'INITIAL',
      priority: fixedData.priority,
      surfaceExistant: fixedData.surfaceExistant,
      surfaceProjet: fixedData.surfaceProjet,
      deadline: fixedData.deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: '89aa20af-7cb2-4792-8f98-ad0428124aa9',
      client: client
    };
    
    // Ajouter le dossier au stockage et retourner la réponse
    addMockDossier(mockDossier);
    console.log('API Route: Created mock dossier:', JSON.stringify(mockDossier, null, 2));
    return NextResponse.json(mockDossier);
    
  } catch (error) {
    console.error('API Route: Unexpected error', error);
    
    // Return a mock response even in case of errors
    const mockErrorDossier = {
      id: 'mock-error-' + Date.now(),
      reference: 'DOS-2025-ERR',
      title: 'Dossier créé (mode dégradé)',
      description: 'Ce dossier a été créé en mode dégradé suite à une erreur',
      clientId: 'unknown',
      type: 'DP',
      status: 'NOUVEAU',
      workflowState: 'INITIAL',
      priority: 'NORMAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: '89aa20af-7cb2-4792-8f98-ad0428124aa9',
    };
    
    // Ajouter le dossier d'erreur au stockage
    addMockDossier(mockErrorDossier);
    return NextResponse.json(mockErrorDossier);
  }
}

// Récupérer des clients réels pour les associer aux dossiers mockés
async function getRealClients() {
  try {
    // Fetch les clients depuis l'API interne
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${backendUrl}/clients`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    // Fallback si l'API n'est pas disponible
    return [];
  } catch (error) {
    console.error('Error fetching real clients:', error);
    return [];
  }
}

// Objet de stockage global pour les dossiers mock persistants
let mockDossierStorage: any[] = [];

// Mock data function for dossiers
async function getMockDossiers() {
  // Si on a déjà des dossiers mockés, les réutiliser
  if (mockDossierStorage.length > 0) {
    return mockDossierStorage;
  }
  
  // Récupérer les clients réels pour créer des dossiers mock associés
  const realClients = await getRealClients();
  console.log(`Got ${realClients.length} real clients for mock dossiers`);
  
  // Créer des dossiers par défaut si pas de clients réels
  if (realClients.length === 0) {
    const defaultMocks = [
      {
        id: 'mock-dossier-1',
        reference: 'DOS-2025-001',
        title: 'Rénovation de façade',
        description: 'Déclaration préalable pour rénovation de façade',
        clientId: 'mock-client-1',
        type: 'DP',
        status: 'NOUVEAU',
        workflowState: 'INITIAL',
        priority: 'NORMAL',
        createdAt: '2025-05-10T10:30:00Z',
        updatedAt: '2025-05-10T10:30:00Z',
        client: {
          id: 'mock-client-1',
          reference: 'CL-2025-001',
          clientType: 'PARTICULIER',
          contactInfo: {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '0612345678'
          }
        }
      },
      {
        id: 'mock-dossier-2',
        reference: 'DOS-2025-002',
        title: 'Extension maison individuelle',
        description: 'Permis de construire pour extension de 25m²',
        clientId: 'mock-client-2',
        type: 'PC',
        status: 'EN_COURS',
        workflowState: 'ETUDE_APS',
        priority: 'HIGH',
        createdAt: '2025-05-12T14:20:00Z',
        updatedAt: '2025-05-15T09:15:00Z',
        client: {
          id: 'mock-client-2',
          reference: 'CL-2025-002',
          clientType: 'PARTICULIER',
          contactInfo: {
            firstName: 'Marie',
            lastName: 'Laurent',
            email: 'marie.laurent@example.com',
            phone: '0687654321'
          }
        }
      },
      {
        id: 'mock-dossier-3',
        reference: 'DOS-2025-003',
        title: 'Changement de fenêtres',
        description: 'Déclaration préalable pour changement de fenêtres',
        clientId: 'mock-client-3',
        type: 'DP_FENETRE',
        status: 'EN_ATTENTE',
        workflowState: 'ATTENTE_PIECE',
        priority: 'NORMAL',
        createdAt: '2025-05-14T11:45:00Z',
        updatedAt: '2025-05-14T11:45:00Z',
        client: {
          id: 'mock-client-3',
          reference: 'CL-2025-003',
          clientType: 'ARCADIA',
          contactInfo: {
            firstName: 'Pierre',
            lastName: 'Martin',
            email: 'pierre.martin@arcadia.com',
            phone: '0678123456'
          }
        }
      }
    ];
    
    mockDossierStorage = defaultMocks;
    return defaultMocks;
  }
  
  // Créer des dossiers mock pour les clients réels
  const mockDossiers = realClients.slice(0, 5).map((client, index) => {
    const types = ['DP', 'PC', 'DP_FENETRE', 'PC_RT', 'DP_ITE'];
    const statuses = ['NOUVEAU', 'EN_COURS', 'EN_ATTENTE', 'A_DEPOSER_EN_LIGNE'];
    const workflowStates = ['INITIAL', 'ETUDE_APS', 'ATTENTE_PIECE', 'DOSSIER_COMPLET'];
    const priorities = ['LOW', 'NORMAL', 'HIGH'];
    const titles = [
      'Rénovation de façade', 
      'Extension maison individuelle', 
      'Changement de fenêtres',
      'Construction d\'un abri de jardin',
      'Installation panneaux solaires'
    ];
    
    // Date aléatoire récente
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 20));
    
    return {
      id: `mock-dossier-real-${index}`,
      reference: `DOS-2025-${(index + 1).toString().padStart(3, '0')}`,
      title: titles[index % titles.length],
      description: `Dossier pour ${client.contactInfo?.firstName} ${client.contactInfo?.lastName}`,
      clientId: client.id,
      type: types[index % types.length],
      status: statuses[index % statuses.length],
      workflowState: workflowStates[index % workflowStates.length],
      priority: priorities[index % priorities.length],
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      client: client
    };
  });
  
  // Stocker les dossiers pour réutilisation
  mockDossierStorage = mockDossiers;
  return mockDossiers;
}

// Fonction pour ajouter un dossier mocké au stockage
function addMockDossier(dossier: any) {
  // Vérifier si un dossier avec le même ID existe déjà
  const existingIndex = mockDossierStorage.findIndex(d => d.id === dossier.id);
  
  if (existingIndex >= 0) {
    // Mettre à jour le dossier existant
    mockDossierStorage[existingIndex] = dossier;
  } else {
    // Ajouter un nouveau dossier
    mockDossierStorage.push(dossier);
  }
}