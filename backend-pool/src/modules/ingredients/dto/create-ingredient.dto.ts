import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ingrediente é obrigatório. Ex: Farinha de Trigo' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória. Ex: kg, L, g, ml, unidade' })
  unit: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória. Ex: Farináceos, Laticínios' })
  category: string;
}
