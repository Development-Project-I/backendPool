import { ApiProperty } from '@nestjs/swagger';

export class AulaInventoryItem {
  @ApiProperty({ example: 1, description: 'ID do ingrediente no inventário' })
  id!: number;

  @ApiProperty({ example: 'Farinha de Trigo', description: 'Nome do insumo' })
  name!: string; 
  @ApiProperty({ example: 'kg', description: 'Unidade de medida padrão' })
  unit!: string; 

  @ApiProperty({ example: 'Farináceos', description: 'Categoria do ingrediente' })
  category!: string;

  @ApiProperty({ 
    enum: ['EM_ESTOQUE', 'BAIXO_ESTOQUE', 'ESGOTADO'], 
    example: 'EM_ESTOQUE', 
    description: 'Status atual do estoque para a aula' 
  })
  stockStatus!: string; 
}

export class ApiAulaResponseDto {
  @ApiProperty({ example: 1, description: 'ID incremental da aula' })
  id!: number; 

  @ApiProperty({ example: 'Cozinha Internacional', description: 'Nome da disciplina/aula' })
  name!: string; 
  @ApiProperty({ example: '2026-06-20', description: 'Data da aula agendada' })
  date!: string; 
  @ApiProperty({ example: 'Turma B', description: 'Identificação da turma' })
  turma!: string; 

  @ApiProperty({ example: 2, description: 'ID do professor responsável (FK)' })
  professorId!: number; 
  @ApiProperty({ example: 'ATIVO', description: 'Status atual da aula (Ex: ATIVO, AGENDADO, CONCLUIDO)' })
  status!: string; 

  @ApiProperty({ type: [AulaInventoryItem], description: 'Lista de ingredientes detalhados vinculados à aula' })
  ingredients!: AulaInventoryItem[];
}