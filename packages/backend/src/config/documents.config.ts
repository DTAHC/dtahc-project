import { registerAs } from '@nestjs/config';

export default registerAs('documents', () => ({
  cadastre: {
    apiBaseUrl: process.env.CADASTRE_API_BASE_URL || 'https://apicarto.ign.fr/api/cadastre',
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    cacheDurationHours: parseInt(process.env.CADASTRE_CACHE_DURATION_HOURS || '24', 10),
    mapsStoragePath: process.env.CADASTRE_MAPS_STORAGE_PATH || 'public/maps'
  },
  
  urbanisme: {
    apiBaseUrl: process.env.URBANISME_API_BASE_URL || 'https://apicarto.ign.fr/api/gpu',
    wfsUrl: process.env.URBANISME_WFS_URL || 'https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wfs',
    gpuBaseUrl: process.env.GPU_BASE_URL || 'https://www.geoportail-urbanisme.gouv.fr',
    cacheDurationHours: parseInt(process.env.URBANISME_CACHE_DURATION_HOURS || '48', 10)
  },
  
  cerfa: {
    templatesPath: process.env.CERFA_TEMPLATES_PATH || 'templates/cerfa',
    outputPath: process.env.CERFA_OUTPUT_PATH || 'public/cerfa',
    autoGenerateNotice: process.env.CERFA_AUTO_GENERATE_NOTICE === 'true'
  }
}));