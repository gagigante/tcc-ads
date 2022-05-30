import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, 
} from 'typeorm';

import { Ong } from './Ong';

@Entity('ong_address')
export class OngAddress {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ong_id: number;

  @Column()
  zip_code: string;

  @Column()
  state: string;

  @Column()
  city: string;
  
  @Column()
  district: string;

  @Column()
  street: string;

  @Column()
  number: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Ong, (ong) => ong.ong_address)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
