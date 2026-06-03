import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ description: 'ID numérico do item buscado no estoque', example: 1 })
  @IsNumber({}, { message: 'O ID do item deve ser um número.' })
  @IsNotEmpty({ message: 'O item do estoque é obrigatório.' })
  itemId: number;

  @ApiProperty({ description: 'Quantidade necessária para a aula', example: 2.5 })
  @IsNumber({}, { message: 'A quantidade deve ser um número válido.' })
  @Min(0.1, { message: 'A quantidade deve ser maior que zero.' })
  quantity: number;

  @ApiProperty({ example: 'unidade' })
  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória. Ex: kg, L, g, ml, unidade' })
  unit: string;
}