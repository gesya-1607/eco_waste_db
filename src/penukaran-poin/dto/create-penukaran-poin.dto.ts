import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreatePenukaranPoinDto {
  @IsNotEmpty()
  @IsInt()
  hadiahId: number;
}
