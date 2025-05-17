import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, UserStatus } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ 
    status: 201, 
    description: 'L\'utilisateur a été créé avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà' })
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des utilisateurs récupérée avec succès',
    type: [UserEntity],
  })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    enum: Role,
    description: 'Filtrer par rôle' 
  })
  @Roles(Role.ADMIN, Role.GESTION)
  @Get()
  findAll(@Query('role') role?: Role) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'L\'utilisateur a été récupéré avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Roles(Role.ADMIN, Role.GESTION)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Récupérer un utilisateur par email' })
  @ApiResponse({ 
    status: 200, 
    description: 'L\'utilisateur a été récupéré avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Roles(Role.ADMIN, Role.GESTION)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'L\'utilisateur a été mis à jour avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà' })
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'L\'utilisateur a été supprimé avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Mettre à jour le statut d\'un utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Le statut de l\'utilisateur a été mis à jour avec succès',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Roles(Role.ADMIN)
  @Patch(':id/status/:status')
  updateStatus(
    @Param('id') id: string, 
    @Param('status') status: UserStatus
  ) {
    return this.usersService.updateStatus(id, status);
  }
}