import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn,
} from 'typeorm';

import { Ong } from './Ong';

@Entity('ong_social_link')
export class OngSocialLink {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ong_id: number;

  @Column()
  social_link_type: 'facebook' | 'instagram' | 'twitter';

  @Column()
  social_link_url: string;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Ong, (ong) => ong.ong_social_links)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
