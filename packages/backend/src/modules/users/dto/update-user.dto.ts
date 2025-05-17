import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    example: 'admin@dtahc.fr',
    description: 'Email de l\'utilisateur',
    required: false,
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de l\'utilisateur',
    required: false,
  })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de l\'utilisateur',
    required: false,
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe de l\'utilisateur',
    required: false,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Rôle de l\'utilisateur',
    required: false,
  })
  @IsEnum(Role, { message: 'Le rôle doit être valide' })
  @IsOptional()
  role?: Role;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Statut de l\'utilisateur',
    required: false,
  })
  @IsEnum(UserStatus, { message: 'Le statut doit être valide' })
  @IsOptional()
  status?: UserStatus;
}