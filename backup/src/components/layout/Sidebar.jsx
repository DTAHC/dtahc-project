import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Flex, VStack, Link, Text, Divider, Icon } from '@chakra-ui/react';
import { FiHome, FiUsers, FiFolder, FiFile, FiSettings, FiDollarSign } from 'react-icons/fi';

// Custom sidebar link component
const SidebarLink = ({ icon, to, children }) => (
  <Link 
    as={NavLink} 
    to={to} 
    style={{ textDecoration: 'none' }}
    _activeLink={{
      color: 'blue.500',
      fontWeight: 'bold',
      bg: 'blue.50'
    }}
  >
    <Flex
      align="center"
      p="3"
      borderRadius="md"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'gray.100',
      }}
    >
      <Icon
        mr="3"
        fontSize="16"
        as={icon}
      />
      <Text fontSize="sm">{children}</Text>
    </Flex>
  </Link>
);

const Sidebar = () => {
  return (
    <Box
      w="240px"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      position="fixed"
      left="0"
      top="0"
      overflowY="auto"
      overflowX="hidden"
    >
      <Box p="5">
        <Text fontSize="xl" fontWeight="bold" mb="6">DTAHC</Text>
        <VStack align="stretch" spacing="1">
          <SidebarLink icon={FiHome} to="/dashboard">
            Tableau de bord
          </SidebarLink>
          <SidebarLink icon={FiUsers} to="/clients">
            Gestion Clients
          </SidebarLink>
          <SidebarLink icon={FiFolder} to="/dossiers">
            Gestion Dossiers
          </SidebarLink>
          <SidebarLink icon={FiFile} to="/documents">
            Gestion Documents
          </SidebarLink>
          <SidebarLink icon={FiDollarSign} to="/comptable">
            Gestion Comptable
          </SidebarLink>
          <SidebarLink icon={FiSettings} to="/settings">
            Paramètres
          </SidebarLink>
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;