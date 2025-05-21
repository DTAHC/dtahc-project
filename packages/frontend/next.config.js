/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les pages explicites
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Configurations supplémentaires - Reduced optimization for debugging
  reactStrictMode: false,
  swcMinify: false,
  output: 'standalone',
  
  // Disable chunk optimization for debugging
  experimental: {
    optimizeCss: false,
    optimizePackageImports: false,
  },
  
  // Résolution du package @dtahc/shared
  webpack: (config, { isServer }) => {
    config.resolve.alias['@dtahc/shared'] = require('path').resolve(__dirname, '../shared/src');
    
    // Disable code splitting for debugging
    if (!isServer) {
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;
    }
    
    return config;
  },
  
  // Pour assurer que toutes les routes sont correctement exposées
  async rewrites() {
    return [
      // Routes de l'application
      {
        source: '/clients',
        destination: '/clients',
      },
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/communication',
        destination: '/communication',
      },
      // Redirection des requêtes API vers le backend
      // Use priority 'first' to ensure API routes are processed before page routes
      {
        source: '/api/:path*',
        has: [
          {
            type: 'header',
            key: 'x-use-backend',
            value: 'true'
          }
        ],
        destination: 'http://localhost:3001/api/:path*',
        basePath: false,
        locale: false,
      },
    ];
  },
}

module.exports = nextConfig