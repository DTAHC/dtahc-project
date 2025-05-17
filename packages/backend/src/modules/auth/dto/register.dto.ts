import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'admin@dtahc.fr',
    description: 'Email de l\'utilisateur',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de l\'utilisateur',
  })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de l\'utilisateur',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe de l\'utilisateur',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Rôle de l\'utilisateur',
    required: false,
  })
  @IsEnum(Role, { message: 'Le rôle doit être valide' })
  @IsOptional()
  role?: Role;
}