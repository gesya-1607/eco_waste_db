import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdatePenukaranPoinDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'diproses',
    'selesai',
    'ditolak',
  ])
  status: string;
}
