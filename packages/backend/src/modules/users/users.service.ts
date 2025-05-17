import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Sélection des champs utilisateur sans mot de passe et refresh token
  private readonly userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
    password: false,
    refreshToken: false,
  };

  async create(createUserDto: CreateUserDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Création de l'utilisateur
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        password: hashedPassword,
        role: createUserDto.role,
        status: createUserDto.status || UserStatus.ACTIVE,
      },
      select: this.userSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.userSelect,
    });
  }

  async findByRole(role: Role) {
    return this.prisma.user.findMany({
      where: { role },
      select: this.userSelect,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec email ${email} non trouvé`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Vérifier si l'utilisateur existe
    await this.findOne(id);

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Préparation des données à mettre à jour
    const data: any = { ...updateUserDto };

    // Hashage du mot de passe si fourni
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    // Vérifier si l'utilisateur existe
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    // Vérifier si l'utilisateur existe
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: this.userSelect,
    });
  }
}