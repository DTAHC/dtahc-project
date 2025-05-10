/**
 * Routes pour la documentation Swagger
 * @module routes/swaggerRoutes
 */

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documentation
 *   description: Accès à la documentation technique
 */

/**
 * @swagger
 * /api/docs/info:
 *   get:
 *     summary: Informations sur les points d'accès API
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Informations sur les routes API disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documentation API disponible"
 *                 docs:
 *                   type: object
 *                   properties:
 *                     swagger:
 *                       type: string
 *                       example: "/api-docs"
 *                     json:
 *                       type: string
 *                       example: "/api-docs.json"
 */
router.get('/info', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    success: true,
    message: 'Documentation API disponible',
    docs: {
      swagger: `${baseUrl}/api-docs`,
      json: `${baseUrl}/api-docs.json`,
    },
    routes: {
      auth: `${baseUrl}/api/auth`,
      health: `${baseUrl}/api/health`,
      docs: `${baseUrl}/api/docs`,
    },
  });
});

module.exports = router;