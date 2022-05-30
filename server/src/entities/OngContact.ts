import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Ong } from './Ong';

@Entity('ong_contact')
export class OngContact {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  contact: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Ong, (ong) => ong.ong_contacts)
  ong: Ong;
}
