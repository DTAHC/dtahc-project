import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreateAccountingRecordDto } from './dto/create-accounting-record.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('accounting')
@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Post()
  @Roles(Role.ADMIN, Role.COMPTABLE)
  @ApiOperation({ summary: 'Créer un nouveau document comptable' })
  @ApiResponse({ status: 201, description: 'Document comptable créé avec succès' })
  create(@Body() createAccountingRecordDto: CreateAccountingRecordDto) {
    return this.accountingService.create(createAccountingRecordDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.COMPTABLE, Role.GESTION)
  @ApiOperation({ summary: 'Récupérer tous les documents comptables' })
  @ApiResponse({ status: 200, description: 'Liste des documents comptables' })
  findAll(@Query('type') type?: string, @Query('status') status?: string, @Query('clientId') clientId?: string) {
    return this.accountingService.findAll({ type, status, clientId });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COMPTABLE, Role.GESTION)
  @ApiOperation({ summary: 'Récupérer un document comptable par ID' })
  @ApiResponse({ status: 200, description: 'Document comptable trouvé' })
  @ApiResponse({ status: 404, description: 'Document comptable non trouvé' })
  findOne(@Param('id') id: string) {
    return this.accountingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COMPTABLE)
  @ApiOperation({ summary: 'Mettre à jour un document comptable' })
  @ApiResponse({ status: 200, description: 'Document comptable mis à jour' })
  @ApiResponse({ status: 404, description: 'Document comptable non trouvé' })
  update(@Param('id') id: string, @Body() updateAccountingRecordDto: any) {
    return this.accountingService.update(id, updateAccountingRecordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COMPTABLE)
  @ApiOperation({ summary: 'Supprimer un document comptable' })
  @ApiResponse({ status: 200, description: 'Document comptable supprimé' })
  @ApiResponse({ status: 404, description: 'Document comptable non trouvé' })
  remove(@Param('id') id: string) {
    return this.accountingService.remove(id);
  }

  @Post(':id/payment')
  @Roles(Role.ADMIN, Role.COMPTABLE)
  @ApiOperation({ summary: 'Enregistrer un paiement pour un document comptable' })
  @ApiResponse({ status: 201, description: 'Paiement enregistré avec succès' })
  @ApiResponse({ status: 404, description: 'Document comptable non trouvé' })
  addPayment(@Param('id') id: string, @Body() paymentData: any) {
    return this.accountingService.addPayment(id, paymentData);
  }

  @Get('stats/summary')
  @Roles(Role.ADMIN, Role.COMPTABLE, Role.GESTION)
  @ApiOperation({ summary: 'Obtenir un résumé des statistiques financières' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès' })
  getStats() {
    return this.accountingService.getStatsSummary();
  }
}