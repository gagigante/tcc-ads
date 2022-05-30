import { 
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { uploadConfig } from '@/config/upload';
import { OngSocialLink } from './OngSocialLink';
import { OngContact } from './OngContact';
import { OngAddress } from './OngAddress';

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

  @OneToOne(
    () => OngAddress, 
    (ongAddress) => ongAddress.ong,
    { cascade: true, eager: true }
  )
  ong_address: OngAddress;

  @OneToMany(
    () => OngSocialLink, 
    (ongSocialLink) => ongSocialLink.ong, 
    { cascade: true, nullable: true, eager: true }
  )
  ong_social_links?: OngSocialLink[];

  @OneToMany(
    () => OngContact, 
    (ongContact) => ongContact.ong,
    { cascade: true, eager: true }
  )
  ong_contacts: OngContact[];

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
