import { DataSource } from 'typeorm';

import { User } from '@/entities/User';
import { UserAddress } from '@/entities/UserAddress';
import { Ong } from '@/entities/Ong';
import { OngAddress } from '@/entities/OngAddress';
import { OngSocialLink } from '@/entities/OngSocialLink';
import { OngContact } from '@/entities/OngContact';
import { Project } from '@/entities/Project';
import { ProjectDonation } from '@/entities/ProjectDonation';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [
    User,
    UserAddress,
    Ong,
    OngAddress,
    OngSocialLink,
    OngContact,
    Project,
    ProjectDonation,
  ],
});