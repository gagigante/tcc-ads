import { DataSource } from 'typeorm';

import { User } from '@/entities/User';
import { Ong } from '@/entities/Ong';
import { OngSocialLink } from '@/entities/OngSocialLink';
import { OngContact } from '@/entities/OngContact';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Ong, OngSocialLink, OngContact],
});