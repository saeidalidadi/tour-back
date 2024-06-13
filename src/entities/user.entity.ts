import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Tour } from './tour.entity';
import { LeadersRate } from './leader-rates';
import { TourReservationEntity } from './tour-reservations.entity';
import { GenderEnum } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ default: true, type: 'varchar', unique: true })
  email?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar' })
  salt?: string;

  @Column({ name: 'roles', nullable: true })
  roles: string;

  @Column({ name: 'avatar', type: 'character varying', default: '' })
  avatar: string;

  @OneToMany(() => Tour, (tour) => tour.owner, { cascade: true })
  tours?: Tour[];

  @OneToMany(() => LeadersRate, (leaderRates) => leaderRates.rate)
  rates?: LeadersRate[];

  @OneToMany(() => TourReservationEntity, (reservation) => reservation.user)
  reservations?: TourReservationEntity[];
}
