import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VerifyItemSetorDto } from './verify-item-setor.dto';

export class VerifySetorSampahDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['diverifikasi', 'ditolak', 'selesai'])
  status: string;

  @IsNotEmpty()
  @IsString()
  catatanAdmin: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VerifyItemSetorDto)
  itemsReal?: VerifyItemSetorDto[];
}
