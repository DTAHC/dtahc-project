/**
 * Configuration Swagger pour la documentation API
 */

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const packageJson = require('../../package.json');

// Définition des options Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DTAHC - Documentation',
      version: packageJson.version,
      description: 'Documentation pour l\'API de gestion des dossiers clients DTAHC',
      contact: {
        name: 'DTAHC',
        url: 'https://github.com/DTAHC/dtahc-project',
        email: 'contact@dtahc.fr',
      },
      license: {
        name: 'Propriétaire',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://api.dtahc.fr',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Accès non autorisé. Authentification requise',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  message: {
                    type: 'string',
                    example: 'Accès non autorisé. Token manquant ou invalide.',
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Accès interdit. Permissions insuffisantes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  message: {
                    type: 'string',
                    example: 'Vous n\'avez pas les permissions nécessaires pour cette action.',
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Erreur de validation des données',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  message: {
                    type: 'string',
                    example: 'Données invalides',
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email',
                        },
                        message: {
                          type: 'string',
                          example: 'Veuillez entrer une adresse email valide',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js'),
  ],
};

// Génération de la spécification Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

/**
 * Configure Express avec Swagger UI
 * @param {Object} app - Instance Express
 */
const setupSwagger = (app) => {
  // Route pour la documentation Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));

  // Route pour la spécification Swagger au format JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Documentation Swagger disponible sur /api-docs');
};

module.exports = {
  setupSwagger,
};