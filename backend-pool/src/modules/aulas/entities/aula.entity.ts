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

  @Column({ type: 'date', default: '2026-01-01' }) // Preenche o passado com uma data padrão
  date!: string;

  @Column({ type: 'character varying', default: 'Turma Geral' }) // Preenche o passado com um texto padrão
  turma!: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.aulas, {
    eager: true,
  })
  @JoinTable({ name: 'aulas_ingredients' })
  ingredients!: Ingredient[];
}
