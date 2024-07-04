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
import { VerificationEntity } from './verification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar', nullable: true })
  salt?: string;

  @Column({ name: 'roles', nullable: true })
  roles: string;

  @Column({ name: 'is_active', default: true, type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'mobile_verified', type: 'boolean', default: false })
  mobileVerified: boolean;

  @Column({ name: 'avatar', type: 'character varying', default: '' })
  avatar: string;

  @Column({ type: 'character varying', nullable: true, unique: true })
  mobile: string;

  @OneToMany(() => Tour, (tour) => tour.owner, { cascade: true })
  tours?: Tour[];

  @OneToMany(() => LeadersRate, (leaderRates) => leaderRates.rate)
  rates?: LeadersRate[];

  @OneToMany(() => TourReservationEntity, (reservation) => reservation.user)
  reservations?: TourReservationEntity[];

  @OneToMany(() => VerificationEntity, (verification) => verification.user, {
    cascade: true,
  })
  authentications?: VerificationEntity[];
}
