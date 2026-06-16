import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { AulaIngredient } from './aula-ingredient.entity';

export enum AulaStatus {
  AGENDADA = 'AGENDADA',
  CANCELADA = 'CANCELADA',
  REALIZADA = 'REALIZADA',
}

@Entity('aulas')
@Unique('UQ_aulas_slot', ['dayOfWeek', 'time'])
export class Aula {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'date', default: '2026-01-01' })
  date!: string;

  @Column({ type: 'character varying', default: 'Turma Geral' })
  turma!: string;

  @Column({ default: 'sem-professor' })
  professorId!: string;

  @Column({ default: 'Cozinha Padrão' })
  kitchen!: string;

  @Column({ default: 'Segunda' })
  dayOfWeek!: string;
  
  @Column({ default: '00:00' })
  time!: string;

  @Column({ type: 'enum', enum: AulaStatus, default: AulaStatus.AGENDADA })
  status!: AulaStatus;

  @OneToMany(() => AulaIngredient, (aulaIngredient) => aulaIngredient.aula, {
    cascade: true,
  })
  aulaIngredients!: AulaIngredient[];
}