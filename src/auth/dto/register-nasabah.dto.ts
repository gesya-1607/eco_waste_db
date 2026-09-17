import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterNasabahDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  namaNasabah: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsNotEmpty()
  @IsString()
  telp: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
