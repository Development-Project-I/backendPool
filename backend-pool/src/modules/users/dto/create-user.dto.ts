import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEnum
} from 'class-validator';

export class CreateUserDto {  
  @ApiProperty({ example: 'João' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;
  
  @ApiProperty({ example: 'Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
  sobrenome!: string;

  @ApiProperty({ example: 'fulano@gastroplan.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: 'senha_super_secreta' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole, { message: 'Cargo inválido.' })
  role!: UserRole;
}