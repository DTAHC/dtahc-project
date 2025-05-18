/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les pages explicites
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Configurations supplémentaires
  reactStrictMode: true,
  swcMinify: true,
  
  // Pour assurer que toutes les routes sont correctement exposées
  async rewrites() {
    return [
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
    ];
  },
}

module.exports = nextConfig