import { IsString, IsNumber, IsNotEmpty, IsDateString, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do item é obrigatório. Ex: Farinha de Trigo' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória. Ex: Farináceos' })
  category: string;

  @IsNumber()
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa' })
  quantity: number;

  @IsDateString({}, { message: 'A data de validade deve estar no padrão ISO (AAAA-MM-DD)' })
  expiryDate: string;
}