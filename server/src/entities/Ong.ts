import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

import { uploadConfig } from '@/config/upload';

@Entity('ongs')
export class Ong {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  cpnj: string;

  @Column()
  thumb_url: string;

  @Column()
  banner_url: string;

  @Column()
  website_url?: string;

  @Column()
  whatsapp_url?: string;

  @Column({ default: false })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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
}
