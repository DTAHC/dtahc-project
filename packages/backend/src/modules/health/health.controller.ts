import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor() {
    console.log('HealthController initialized');
  }
  
  @Get()
  @ApiOperation({ summary: 'Vérifier l\'état de l\'API' })
  @ApiResponse({ status: 200, description: 'API opérationnelle' })
  check() {
    console.log('Health check endpoint called at', new Date().toISOString());
    return {
      status: 'ok',
      message: 'API opérationnelle',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }
}