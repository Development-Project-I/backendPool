import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  ESTOQUISTA = 'ESTOQUISTA',
  PROFESSOR = 'PROFESSOR',
}

export enum UserStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name!: string;

  @Column({ nullable: true })
  sobrenome?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PROFESSOR })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ATIVO })
  status!: UserStatus;

  @Column({ nullable: true, type: 'timestamp' })
  lastAccess?: Date;
}
