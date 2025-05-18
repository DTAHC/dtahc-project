import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DossierType, Priority } from '@prisma/client';

export class CreateDossierDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  clientId: string;

  @IsEnum(DossierType)
  type: DossierType;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsOptional()
  @IsNumber()
  surfaceExistant?: number;

  @IsOptional()
  @IsNumber()
  surfaceProjet?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}