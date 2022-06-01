import { FindOptionsWhere } from 'typeorm';

import { Ong } from '@/entities/Ong';
import { ICreateOngDto } from '@/dtos/ICreateOngDto';

export interface IOngsRepository {
  getAll(query?: FindOptionsWhere<Ong> | FindOptionsWhere<Ong>[]): Promise<Ong[]>;
  getById(id: number): Promise<Ong | null>;
  create(data: ICreateOngDto): Ong;
  save(user: Ong): Promise<Ong>;
}
