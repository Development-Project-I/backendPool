import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 'Confeitaria Avançada' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da aula é obrigatório.' })
  name: string;

  @ApiProperty({ description: 'ID do usuário professor', example: 'uuid-do-professor' })
  @IsString()
  @IsNotEmpty({ message: 'O professor é obrigatório.' })
  professorId: string;

  @ApiProperty({ example: 'Cozinha A' })
  @IsString()
  @IsNotEmpty({ message: 'A cozinha é obrigatória.' })
  kitchen: string;

  @ApiProperty({ description: 'Dia da semana', example: 'Segunda' })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  time: string;
}