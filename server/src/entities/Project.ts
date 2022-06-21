import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn, 
} from 'typeorm';
import { Expose } from 'class-transformer';

import { Ong } from './Ong';
import { ProjectDonation } from './ProjectDonation';
import { uploadConfig } from '@/config/upload';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ong_id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  donation_description: string;

  @Column({ nullable: true })
  thumb_url: string;

  @Column({ nullable: true })
  banner_url: string;

  @Column({ nullable: true })
  donation_value_goal: number;

  @Column({ nullable: true })
  donation_goal: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ProjectDonation, 
    (projectDonation) => projectDonation.project, 
    { cascade: true }
  )
  donations: ProjectDonation[];
    
  @ManyToOne(() => Ong, (ong) => ong.projects)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  @Expose({ name: 'thumb_url' })
  getThumbUrl(): string | null {
    if (!this.thumb_url) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.thumb_url}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.thumb_url}`;
      default:
        return null;
    }
  }

  @Expose({ name: 'banner_url' })
  getBannerUrl(): string | null {
    if (!this.banner_url) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.banner_url}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.banner_url}`;
      default:
        return null;
    }
  }
}
