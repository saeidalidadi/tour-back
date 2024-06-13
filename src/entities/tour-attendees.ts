import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourReservationEntity } from './tour-reservations.entity';
import { GenderEnum } from '../enums';

@Entity('tour_attendees')
export class TourAttendeesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fullName' })
  fullName: string;

  @Column({ name: 'national_id' })
  nationalId: string;

  @Column({ name: 'mobile' })
  mobile: string;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @ManyToOne(() => TourReservationEntity, (rsv) => rsv.attendees)
  @JoinColumn({ name: 'reservation_id' })
  reservation?: TourReservationEntity;
}
