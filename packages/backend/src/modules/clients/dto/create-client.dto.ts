import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength, IsBoolean } from 'class-validator';
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

  @IsOptional()
  @IsString()
  @MinLength(10)
  phone?: string;
  
  @IsOptional()
  @IsString()
  proReferenceId?: string;
  
  @IsOptional()
  @IsString()
  street?: string;
  
  @IsOptional()
  @IsString()
  city?: string;
  
  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  sendFormLink?: boolean;
}