import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tour } from './tour.entity';

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

  @Column({ name: 'roles', nullable: true })
  roles: string;

  @OneToMany(() => Tour, (tour) => tour.owner, { cascade: true })
  tours?: Tour[];
}
