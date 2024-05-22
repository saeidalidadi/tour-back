import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ImageEntity } from './images.entity';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

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
