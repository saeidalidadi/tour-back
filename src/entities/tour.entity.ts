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
}
