import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Tour } from './tour.entity';
import { LeadersRate } from './leader-rates';

@Entity('leaders')
export class Leader {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

  @Column({ name: 'mobile', type: 'character varying' })
  mobile: string;

  @Column({ type: 'float', default: 0 })
  stars: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Tour, (tour) => tour.leader)
  tours?: Tour[];

  @Column({ type: 'text', nullable: true })
  intro: string;

  @OneToMany(() => LeadersRate, (leaderRates) => leaderRates.rate)
  rates?: LeadersRate[];
}
