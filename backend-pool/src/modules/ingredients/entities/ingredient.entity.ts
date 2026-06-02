import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Aula } from '../../aulas/entities/aula.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // Ex: Farinha de Trigo

  @Column()
  unit!: string; // Unidade de medida: kg, L, g, ml, unidade

  @Column()
  category!: string; // Ex: Farináceos, Laticínios

  @ManyToMany(() => Aula, (aula) => aula.ingredients)
  aulas!: Aula[];
}
