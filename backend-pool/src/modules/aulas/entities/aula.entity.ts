import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { AulaIngredient } from './aula-ingredient.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 'sem-professor' })
  professorId!: string;

  @Column({ default: 'Cozinha Padrão' })
  kitchen!: string;

  @Column({ default: 'Segunda' })
  dayOfWeek!: string;

  @Column({ default: '00:00' })
  time!: string;

  @OneToMany(() => AulaIngredient, (aulaIngredient) => aulaIngredient.aula, {
    cascade: true,
    eager: true,
  })
  aulaIngredients!: AulaIngredient[];
}