import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  ESTOQUISTA = 'ESTOQUISTA',
  PROFESSOR = 'PROFESSOR'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PROFESSOR })
  role: UserRole;
}
