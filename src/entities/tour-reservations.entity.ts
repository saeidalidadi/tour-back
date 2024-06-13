import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tour } from './tour.entity';
import { User } from './user.entity';
import { TourAttendeesEntity } from './tour-attendees';

@Entity('tour_reservations')
export class TourReservationEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Tour, (user) => user.reservations)
  @JoinColumn({ name: 'tour_id' })
  tour?: Tour;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => TourAttendeesEntity, (attendees) => attendees.reservation, {
    cascade: true,
  })
  attendees?: TourAttendeesEntity[];
}
