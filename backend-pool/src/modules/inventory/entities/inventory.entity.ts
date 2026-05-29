import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Farinha de Trigo

  @Column()
  category: string; //Farináceos

  @Column('float')
  quantity: number; // Quantidade

  @Column({ type: 'timestamp' })
  expiryDate: Date; // Data de Validade

  @Column({ default: 'kg' })
  unit: string; // Unidade de Medida (kg, g, l, ml, etc.)

  @Column('float', { default: 0 })
  minStock: number; // Estoque Mínimo

  @Column({nullable: true})
  batchNumber: string; // Número do Lote
}