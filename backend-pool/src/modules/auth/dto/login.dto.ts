import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Pode ser o e-mail ou a matrícula' })
  @IsNotEmpty()
  @IsString()
  identificador: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}