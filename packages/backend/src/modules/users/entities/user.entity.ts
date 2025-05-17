import { ApiProperty } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';

export class UserEntity {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Identifiant unique de l\'utilisateur',
  })
  id: string;

  @ApiProperty({
    example: 'admin@dtahc.fr',
    description: 'Email de l\'utilisateur',
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'Prénom de l\'utilisateur',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Nom de l\'utilisateur',
  })
  lastName: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Rôle de l\'utilisateur',
  })
  role: Role;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Statut de l\'utilisateur',
  })
  status: UserStatus;

  @ApiProperty({
    example: '2023-05-17T14:30:00Z',
    description: 'Date de création de l\'utilisateur',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-17T14:30:00Z',
    description: 'Date de dernière mise à jour de l\'utilisateur',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2023-05-17T14:30:00Z',
    description: 'Date de dernière connexion',
    required: false,
  })
  lastLoginAt?: Date;
}