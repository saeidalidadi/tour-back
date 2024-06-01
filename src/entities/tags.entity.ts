import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'character varying' })
  name: string;
}
