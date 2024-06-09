import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Leader } from './leaders.entity';

@Entity('leader_rates')
export class LeadersRate {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'float4' })
  rate: number;

  @ManyToOne(() => User, (user) => user.rates)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Leader, (leader) => leader.rates)
  @JoinColumn({ name: 'leader_id' })
  leader: Leader;
}
