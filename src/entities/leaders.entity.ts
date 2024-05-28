import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('leaders')
export class Leader {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

  @Column()
  mobile: string;

  @Column({ type: 'float', default: 0 })
  stars: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
