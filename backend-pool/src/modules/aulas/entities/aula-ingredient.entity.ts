import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Aula } from './aula.entity';
import { InventoryItem } from '../../inventory/entities/inventory.entity';

@Entity('aula_ingredients')
export class AulaIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  // ponte com a aula
  @ManyToOne(() => Aula, (aula) => aula.aulaIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aulaId' })
  aula: Aula;

  // ponte com o item do estoque (SET NULL preserva o vínculo se o item for excluído)
  @ManyToOne(() => InventoryItem, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem | null;

  // snapshot: preserva dados mesmo se o item do estoque for excluído
  @Column({ nullable: true })
  itemId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column('float')
  quantity: number;

  @Column()
  unit: string;
}