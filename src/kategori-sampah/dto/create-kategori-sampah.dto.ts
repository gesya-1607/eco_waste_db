import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKategoriSampahDto {
  @IsNotEmpty()
  @IsString()
  namaKategori: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hargaPerKg: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  poinPerKg: number;

  @IsNotEmpty()
  @IsString()
  @IsIn([
    'plastik',
    'kertas',
    'logam',
    'kaca',
  ])
  jenis: string;
}
