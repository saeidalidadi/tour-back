import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Page } from './page.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ default: true, type: 'varchar', unique: true })
  email?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar' })
  salt?: string;

  @OneToMany('Page', 'user')
  pages?: Page[];

  @Column({ type: 'bool', default: false })
  isProvider?: boolean;
}
