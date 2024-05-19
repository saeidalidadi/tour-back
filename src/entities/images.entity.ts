import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tour } from './tour.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'path' })
  path: string;

  @ManyToOne(() => Tour, (user) => user.images)
  @JoinColumn({ name: 'tour_id' })
  tour?: Tour;
}
