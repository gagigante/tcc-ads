import { 
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Ong } from './Ong';
import { UserAddress } from './UserAddress';
import { ProjectDonation } from './ProjectDonation';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  ong_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  birth_date: Date;

  @Column()
  password: string;

  @Column({ default: 'doador' })
  role: 'doador' | 'colaborador' | 'gestor';

  @Column()
  is_active: boolean;

  @Column({ nullable: true })
  activation_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    () => UserAddress, 
    (userAddress) => userAddress.user,
    { cascade: true, eager: true }
  )
  user_address: UserAddress;

  @ManyToOne(() => Ong, (ong) => ong.ong_users)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  @OneToMany(
    () => ProjectDonation, 
    (projectDonation) => projectDonation.user,
    { onDelete: 'SET NULL' }
  )
  donations: ProjectDonation[];
}
