import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, 
} from 'typeorm';

import { User } from './User';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

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

  @OneToOne(() => User, (user) => user.user_address)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
