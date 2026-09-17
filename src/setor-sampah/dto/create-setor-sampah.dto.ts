import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ItemSetorDto } from './item-setor.dto';

export class CreateSetorSampahDto {
  @IsNotEmpty()
  @IsDateString()
  tanggal: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemSetorDto)
  items: ItemSetorDto[];
}
