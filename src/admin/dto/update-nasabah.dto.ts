import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateNasabahDto {
  @IsNotEmpty()
  @IsString()
  namaLengkap: string;

  @IsNotEmpty()
  @IsString()
  noTelepon: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsDateString()
  tanggalLahir?: string;
}
