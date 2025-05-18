import React, { useState } from 'react';
import { Box, Heading, SimpleGrid, Card, CardBody, Text, Badge, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Spacer } from '@chakra-ui/react';

const ComptablePage = () => {
  // Données fictives pour l'exemple
  const facturesMock = [
    { id: 'FAC-2023-001', client: 'Dupont Jean', montant: 1250.00, date: '2023-10-15', statut: 'PAID', type: 'FACTURE' },
    { id: 'FAC-2023-002', client: 'Martin Sophie', montant: 850.50, date: '2023-11-02', statut: 'PENDING', type: 'FACTURE' },
    { id: 'DEV-2023-003', client: 'Bernard Thomas', montant: 2100.00, date: '2023-11-10', statut: 'PENDING', type: 'DEVIS' },
    { id: 'FAC-2023-004', client: 'Petit Marie', montant: 970.25, date: '2023-10-25', statut: 'PARTIAL', type: 'FACTURE' },
    { id: 'DEV-2023-005', client: 'Dubois Pierre', montant: 1600.00, date: '2023-11-15', statut: 'CANCELLED', type: 'DEVIS' },
  ];

  // État pour les filtres
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrer les factures selon le statut
  const filteredFactures = statusFilter === 'all' 
    ? facturesMock 
    : facturesMock.filter(f => f.statut === statusFilter);

  // Formatter un statut en badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <Badge colorScheme="green">Payée</Badge>;
      case 'PENDING':
        return <Badge colorScheme="blue">En attente</Badge>;
      case 'PARTIAL':
        return <Badge colorScheme="yellow">Partiel</Badge>;
      case 'CANCELLED':
        return <Badge colorScheme="red">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>Gestion Comptable</Heading>
      
      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Card bg="blue.50">
          <CardBody>
            <Text fontWeight="semibold" mb={2}>Factures</Text>
            <Text fontSize="xl" fontWeight="bold">12</Text>
          </CardBody>
        </Card>
        
        <Card bg="green.50">
          <CardBody>
            <Text fontWeight="semibold" mb={2}>Paiements reçus</Text>
            <Text fontSize="xl" fontWeight="bold">8 550,00 €</Text>
          </CardBody>
        </Card>
        
        <Card bg="red.50">
          <CardBody>
            <Text fontWeight="semibold" mb={2}>Paiements en attente</Text>
            <Text fontSize="xl" fontWeight="bold">3 200,00 €</Text>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Filtres */}
      <Flex mb={4}>
        <Box>
          <Button 
            variant={statusFilter === 'all' ? "solid" : "outline"} 
            colorScheme="blue" 
            size="sm" 
            mr={2}
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </Button>
          <Button 
            variant={statusFilter === 'PAID' ? "solid" : "outline"} 
            colorScheme="green" 
            size="sm" 
            mr={2}
            onClick={() => setStatusFilter('PAID')}
          >
            Payés
          </Button>
          <Button 
            variant={statusFilter === 'PENDING' ? "solid" : "outline"} 
            colorScheme="blue" 
            size="sm" 
            mr={2}
            onClick={() => setStatusFilter('PENDING')}
          >
            En attente
          </Button>
        </Box>
        <Spacer />
        <Button colorScheme="blue" size="sm">
          Nouvelle Facture
        </Button>
      </Flex>
      
      {/* Tableau des factures */}
      <Card>
        <CardBody overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Référence</Th>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th isNumeric>Montant</Th>
                <Th>Statut</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredFactures.map((facture) => (
                <Tr key={facture.id}>
                  <Td>{facture.id}</Td>
                  <Td>{new Date(facture.date).toLocaleDateString()}</Td>
                  <Td>{facture.client}</Td>
                  <Td isNumeric>{facture.montant.toFixed(2)} €</Td>
                  <Td>{getStatusBadge(facture.statut)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ComptablePage;