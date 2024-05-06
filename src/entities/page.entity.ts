import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'page_id' })
  pageId?: string;

  @Column({ type: 'integer', default: 0 })
  followers?: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne('User', 'pages', {})
  user?: User;
}
