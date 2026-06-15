import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { Aula } from './entities/aula.entity';
import { AulaIngredient } from './entities/aula-ingredient.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { InventoryItem } from '../inventory/entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Ingredient, AulaIngredient, InventoryItem])],
  controllers: [AulasController],
  providers: [AulasService],
})
export class AulasModule {}
