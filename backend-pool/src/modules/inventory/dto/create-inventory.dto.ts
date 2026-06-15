import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDateString, Min, IsOptional} from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ example: 'Farinha de Trigo' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do item é obrigatório. Ex: Farinha de Trigo' })
  name: string;

  @ApiProperty({ example: 'Farináceos' })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória. Ex: Farináceos' })
  category: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa' })
  quantity: number;

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString({}, { message: 'A data de validade deve estar no padrão ISO (AAAA-MM-DD)' })
  expiryDate: string;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória.' })
  unit: string;
  
  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0, { message: 'O estoque mínimo não pode ser negativo' })
  minStock: number;

  @ApiProperty({ required: false, example: 'FT2026-045' })
  @IsOptional()
  @IsString()
  batchNumber?: string;
}