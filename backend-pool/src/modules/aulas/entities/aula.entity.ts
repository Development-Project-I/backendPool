import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // Ex: Técnicas de Panificação

  @Column({ type: 'date' })
  date!: string; // Data da aula (AAAA-MM-DD)

  @Column()
  turma!: string; // Ex: Turma A

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.aulas, {
    eager: true,
  })
  @JoinTable({ name: 'aulas_ingredients' })
  ingredients!: Ingredient[];
}
