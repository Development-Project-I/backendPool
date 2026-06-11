import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItem } from './entities/inventory.entity';
import { AulaIngredient } from '../aulas/entities/aula-ingredient.entity'; // <-- Importe aqui

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, AulaIngredient])], 
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}