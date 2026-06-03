import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Aula } from './aula.entity';
import { InventoryItem } from '../../inventory/entities/inventory.entity'; // Importa o Estoque

@Entity('aula_ingredients')
export class AulaIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  // ponte com a aula
  @ManyToOne(() => Aula, (aula) => aula.aulaIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aulaId' })
  aula: Aula;

  // ponte com o ttem do estoque
  @ManyToOne(() => InventoryItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem;

  @Column('float')
  quantity: number;

  @Column()
  unit: string;
}