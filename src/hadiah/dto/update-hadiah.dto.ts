import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class UpdateHadiahDto {
  @IsNotEmpty()
  namaHadiah: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  poinDibutuhkan: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stok: number;
}
