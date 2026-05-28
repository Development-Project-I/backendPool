import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  FUNCIONARIO = 'FUNCIONARIO',
  ESTOQUISTA = 'ESTOQUISTA',
  PROFESSOR = 'PROFESSOR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  matricula: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FUNCIONARIO })
  role: UserRole;
}
