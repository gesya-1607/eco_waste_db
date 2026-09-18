import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHadiahDto {
  @IsNotEmpty()
  namaHadiah: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  poinDibutuhkan: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stok: number;
}
