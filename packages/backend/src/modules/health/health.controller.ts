import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Vérifier l\'état de l\'API' })
  @ApiResponse({ status: 200, description: 'API opérationnelle' })
  check() {
    return {
      status: 'ok',
      message: 'API opérationnelle',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }
}