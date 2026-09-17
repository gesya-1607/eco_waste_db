import {
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemSetorDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  kategoriSampahId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  beratKg: number;
}
