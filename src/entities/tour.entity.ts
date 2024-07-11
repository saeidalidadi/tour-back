import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ImageEntity } from './images.entity';
import { TagEntity } from './tags.entity';
import { Leader } from './leaders.entity';
import { TourReservationEntity } from './tour-reservations.entity';
import { TourStatus } from '../enums';

export type TimelineItem = {
  planDescription: string;
  duration: {
    from: string;
    to: string;
  };
};
@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id?: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'tour_name' })
  tourName?: string;

  @Column({ name: 'tour_description', type: 'text', default: '' })
  tourDescription?: string;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'finish_date', type: 'timestamptz' })
  finishDate: Date;

  @Column({ type: 'int4' })
  price: number;

  @Column({ name: 'tour_attendance', default: 1, type: 'int4' })
  tourAttendance: number;

  @Column({ name: 'origin_province' })
  originProvince: string;

  @Column({ name: 'origin_city' })
  originCity: string;

  @Column({ name: 'destination_province' })
  destinationProvince: string;

  @Column({ name: 'destination_city' })
  destinationCity: string;

  @Column({ type: 'enum', enum: TourStatus, default: TourStatus.RELEASED })
  status: TourStatus;

  @Column({ type: 'json', default: '[]' })
  timeline: TimelineItem[];

  @OneToMany(() => ImageEntity, (photo) => photo.tour, { cascade: true })
  @JoinColumn({ name: 'images' })
  images?: ImageEntity[];

  @ManyToOne(() => User, (user) => user.tours)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @ManyToMany(() => TagEntity)
  @JoinTable({ name: 'tours_tags' })
  tags: TagEntity[];

  @VirtualColumn({
    query: (alias) => `substring(tour.tourDescription for 250)`,
  })
  subDescription: string;

  @VirtualColumn({
    query: (alias) => `DATE_PART('day', tour.finishDate - tour.startDate)`,
  })
  days: number;

  @Column({ name: 'rejection_comment', nullable: true })
  rejectionComment: string;

  @ManyToOne(() => Leader, (leader) => leader.tours)
  @JoinColumn({ name: 'leader_id' })
  leader: Leader;

  @OneToMany(() => TourReservationEntity, (reservation) => reservation.tour)
  reservations?: TourReservationEntity[];
}
