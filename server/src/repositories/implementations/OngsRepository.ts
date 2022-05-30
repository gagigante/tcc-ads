
import { FindOptionsWhere, Repository } from 'typeorm';

import { appDataSource } from '@/database/dataSource';

import { Ong } from '@/entities/Ong';
import { ICreateOngDto } from '@/dtos/ICreateOngDto';
import { IOngsRepository } from '../models/IOngsRepository';

export class OngsRepository implements IOngsRepository {
  private repository: Repository<Ong>;

  constructor() {
    this.repository = appDataSource.getRepository(Ong);
  }

  public async getAll(
    query?: FindOptionsWhere<Ong> | FindOptionsWhere<Ong>[]
  ): Promise<Ong[]> {
    const ongs = await this.repository.find({
      where: query
    });

    return ongs; 
  }

  public async getById(id: number): Promise<Ong> {
    const ong = await this.repository.findOne({
      where: { id },
    });

    return ong;
  }

  public create(ongData: ICreateOngDto): Ong {
    const ong = this.repository.create(ongData);

    return ong;
  }

  public async save(ong: Ong): Promise<Ong> {
    return this.repository.save(ong);
  }
}
