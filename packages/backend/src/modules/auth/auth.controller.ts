import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur connecté avec succès et tokens générés',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ 
    status: 201, 
    description: 'Utilisateur créé avec succès',
  })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Rafraîchir le token d\'accès' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens rafraîchis avec succès',
  })
  @ApiResponse({ status: 401, description: 'Refresh token invalide' })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    const user = req.user as any;
    return this.authService.refreshTokens(user.id, refreshTokenDto.refreshToken);
  }

  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur déconnecté avec succès',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user.id);
  }

  @ApiOperation({ summary: 'Obtenir le profil utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profil récupéré avec succès',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}