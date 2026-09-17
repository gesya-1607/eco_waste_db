import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  namaUnit: string;

  @IsNotEmpty()
  @IsString()
  namaPengelola: string;

  @IsNotEmpty()
  @IsString()
  telp: string;
}
