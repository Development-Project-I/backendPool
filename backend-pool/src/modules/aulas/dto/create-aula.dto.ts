import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsInt,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da aula é obrigatório. Ex: Técnicas de Panificação' })
  name!: string; // Adicionado o !

  @IsDateString({}, { message: 'A data da aula deve estar no padrão ISO (AAAA-MM-DD)' })
  date!: string; // Adicionado o !

  @IsString()
  @IsNotEmpty({ message: 'A turma é obrigatória. Ex: Turma A' })
  turma!: string; // Adicionado o !

  // VALIDAÇÃO EXIGIDA NA TASK
  @IsInt({ message: 'O professorId deve ser um número de ID válido.' })
  @IsNotEmpty({ message: 'O ID do professor é obrigatório.' })
  professorId!: number; // Adicionado o !

  @IsArray({ message: 'ingredientIds deve ser um array de IDs' })
  @ArrayNotEmpty({ message: 'A aula deve ter ao menos um ingrediente' })
  @IsInt({ each: true, message: 'Cada ingredientId deve ser um número inteiro' })
  ingredientIds!: number[]; // Adicionado o !
}