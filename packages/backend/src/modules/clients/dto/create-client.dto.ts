import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ClientType } from '@prisma/client';

export class CreateClientDto {
  @IsEnum(ClientType)
  clientType: ClientType;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;
  
  @IsOptional()
  @IsString()
  proReferenceId?: string;
  
  // Adresse
  @IsString()
  street: string;
  
  @IsString()
  city: string;
  
  @IsString()
  postalCode: string;
}