import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" ml="240px" p="4" overflow="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;