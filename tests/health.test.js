/**
 * Tests pour les routes de santé
 */
const request = require('supertest');
const app = require('../src/index');

describe('Routes de santé', () => {
  test('GET /api/health devrait retourner un statut 200 et UP', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
  });

  test('GET /api/health/detailed devrait retourner des informations détaillées', async () => {
    const response = await request(app).get('/api/health/detailed');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
    expect(response.body.dependencies).toBeDefined();
    expect(response.body.memory).toBeDefined();
    expect(response.body.uptime).toBeDefined();
  });
});