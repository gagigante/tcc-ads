import { Ong } from '@/entities/Ong';
import { ICreateOngDto } from '@/dtos/ICreateOngDto';

export interface IOngsRepository {
  getAll(): Promise<Ong[]>;
  getById(id: number): Promise<Ong | undefined>;
  create(data: ICreateOngDto): Ong;
  save(user: Ong): Promise<Ong>;
}
