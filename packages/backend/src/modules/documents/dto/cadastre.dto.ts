import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ParcelleByReferenceDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  numero: string;
}

export class ParcelleByCoordinatesDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;
}

export class ParcellesByCommuneDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  start?: number;
}

export class CommuneDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;
}

export class FeuilleCadastraleDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;

  @IsString()
  @IsOptional()
  section?: string;
}

export class LocalisantDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  numero: string;
}

export class GenerateMapDto {
  @IsString()
  @IsNotEmpty()
  codeInsee: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  scale?: number; // 500 ou 3500
}