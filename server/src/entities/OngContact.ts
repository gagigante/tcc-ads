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

@Entity('ong_contacts')
export class OngContact {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ong_id: number;

  @Column()
  contact: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Ong, (ong) => ong.ong_contacts)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
