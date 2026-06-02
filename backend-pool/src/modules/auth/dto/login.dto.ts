import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail' })
  @IsNotEmpty()
  @IsString()
  identificador: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}