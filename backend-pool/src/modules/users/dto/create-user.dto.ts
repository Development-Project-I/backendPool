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
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'O número de matrícula é obrigatório.' })
  @Matches(/^\d+$/, { message: 'A matrícula deve conter apenas números.' })
  matricula!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @IsEnum(UserRole, { message: 'Cargo inválido.' })
  @IsNotEmpty({ message: 'O cargo é obrigatório.' })
  role!: UserRole;
}
