import { uploadConfig } from '@/config/upload';
import { Expose } from 'class-transformer';
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

  @Column({ nullable: true })
  user_id: number;

  @Column({ default: 'dinheiro' })
  type: 'dinheiro' | 'outro';

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  value: number;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true, default: 'pendente' })
  status: 'pendente' | 'realizado';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.donations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.donations, { eager: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Expose({ name: 'file' })
  getFileUrl(): string | null {
    if (!this.file) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.file}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.file}`;
      default:
        return null;
    }
  }
}
