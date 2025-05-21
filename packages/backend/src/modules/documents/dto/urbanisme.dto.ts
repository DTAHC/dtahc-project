import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentUrbanismeDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;
}

export class ZonagesDto {
  @IsObject()
  @IsNotEmpty()
  geometry: any;
}

export class ServitudesDto {
  @IsObject()
  @IsNotEmpty()
  geometry: any;
}

export class PrescriptionsDto {
  @IsObject()
  @IsNotEmpty()
  geometry: any;
}

export class ReglementDto {
  @IsString()
  @IsNotEmpty()
  idDocument: string;

  @IsString()
  @IsNotEmpty()
  idZonage: string;
}

export class CompleteUrbanismeInfoDto {
  @IsObject()
  @IsNotEmpty()
  parcelleGeometry: any;
}

export class UrbanismeByParcelleDto {
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