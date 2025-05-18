import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ClientsPage from './pages/ClientsPage';
import ComptablePage from './pages/ComptablePage';
import { Box, Flex } from '@chakra-ui/react';
import ClientList from './components/client/ClientList';
import ClientForm from './components/client/ClientForm';
import ClientDetail from './components/client/ClientDetail';
import './App.css';

// Créer un client React Query
const queryClient = new QueryClient();

// Pages temporaires pour le développement
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Tableau de bord</h1>
    <p>Contenu du tableau de bord ici.</p>
  </div>
);

const Dossiers = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Gestion des dossiers</h1>
    <p>Contenu de la gestion des dossiers ici.</p>
  </div>
);

const Documents = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Gestion des documents</h1>
    <p>Contenu de la gestion des documents ici.</p>
  </div>
);

const Settings = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Paramètres du système</h1>
    <p>Contenu des paramètres ici.</p>
  </div>
);

const AccessDenied = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px', color: 'red' }}>Accès refusé</h1>
    <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
  </div>
);

const NotFound = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Page non trouvée</h1>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route path="/login" element={<LoginForm />} />
            
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            
            <Route
              path="/clients"
              element={
                <Layout>
                  <ClientList />
                </Layout>
              }
            />
            
            <Route
              path="/clients/nouveau"
              element={
                <Layout>
                  <ClientForm />
                </Layout>
              }
            />
            
            <Route
              path="/clients/:id"
              element={
                <Layout>
                  <ClientDetail />
                </Layout>
              }
            />
            
            <Route
              path="/clients/:id/modifier"
              element={
                <Layout>
                  <ClientForm />
                </Layout>
              }
            />
            
            <Route
              path="/dossiers"
              element={
                <Layout>
                  <Dossiers />
                </Layout>
              }
            />
            
            <Route
              path="/documents"
              element={
                <Layout>
                  <Documents />
                </Layout>
              }
            />

            <Route
              path="/comptable"
              element={
                <Layout>
                  <ComptablePage />
                </Layout>
              }
            />
            
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
            
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
    </QueryClientProvider>
  );
}

export default App;