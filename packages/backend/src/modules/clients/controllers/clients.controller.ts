import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Req() req: Request) {
    // @ts-ignore - L'objet user est bien ajouté dans le middleware d'authentification
    const userId = req.user.userId;
    return this.clientsService.create(createClientDto, userId);
  }

  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.clientsService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }
}