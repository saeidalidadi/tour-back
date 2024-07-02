import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VerificationTypeEnum } from '../enums';

@Entity('verifications')
export class VerificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'verification_code', type: 'character varying' })
  verificationCode: string;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @Column({
    name: 'verification_type',
    enum: VerificationTypeEnum,
    type: 'enum',
  })
  verificationType: VerificationTypeEnum;

  @ManyToOne(() => User, (user) => user.authentications)
  user: User;
}
