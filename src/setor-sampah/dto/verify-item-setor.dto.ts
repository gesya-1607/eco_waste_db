import {
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyItemSetorDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  kategoriSampahId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  beratKgReal: number;
}
