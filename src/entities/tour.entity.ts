import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ImageEntity } from './images.entity';

export enum TourStatus {
  RELEASED = 'released',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}
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

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
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

  @Column({ enum: TourStatus, default: TourStatus.RELEASED })
  status: TourStatus;

  @Column({ type: 'json', default: '[]' })
  timeline: TimelineItem[];

  @OneToMany(() => ImageEntity, (photo) => photo.tour, { cascade: true })
  images?: ImageEntity[];
  // @Column({ type: 'simple-array', array: true })
  // images: Array<string>;
  // @JoinColumn({ name: 'user_id' })
  // @ManyToOne('User', 'pages', {})
  // user?: User;
  @ManyToOne(() => User, (user) => user.tours)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;
}
