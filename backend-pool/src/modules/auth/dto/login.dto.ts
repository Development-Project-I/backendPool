import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail', example: 'fulano@gastroplan.com' })
  @IsNotEmpty()
  @IsString()
  identificador: string;

  @ApiProperty({ example: 'senha_super_secreta' })
  @IsNotEmpty()
  @IsString()
  password: string;
}