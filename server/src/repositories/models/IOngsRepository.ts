import { FindOptionsWhere } from 'typeorm';

import { Ong } from '@/entities/Ong';
import { ICreateOngDto } from '@/dtos/ICreateOngDto';

export interface IOngsRepository {
  getAllOngs(
    query?: FindOptionsWhere<Ong> | FindOptionsWhere<Ong>[]
  ): Promise<Ong[]>;
  getOngById(id: number): Promise<Ong | null>;
  create(data: ICreateOngDto): Ong;
  save(ong: Ong): Promise<Ong>;
}
