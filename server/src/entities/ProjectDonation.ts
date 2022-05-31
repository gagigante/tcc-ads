import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from './Project';
import { User } from './User';

@Entity('project_donations')
export class ProjectDonation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  project_id: number;

  @Column()
  user_id: number;

  @Column()
  type: 'dinheiro' | 'outro';

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  value: number;

  @Column({ nullable: true })
  file: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.donations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.donations)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}