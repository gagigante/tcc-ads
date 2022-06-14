
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

  public async getOng(
    query?: FindOptionsWhere<Ong> | FindOptionsWhere<Ong>[]
  ): Promise<Ong> {
    const ong = await this.repository.findOne({
      where: query
    });

    return ong; 
  }

  public async getAllOngs(
    query?: FindOptionsWhere<Ong> | FindOptionsWhere<Ong>[]
  ): Promise<Ong[]> {
    const ongs = await this.repository.find({
      where: query
    });

    return ongs; 
  }

  public async getOngById(id: number): Promise<Ong | null> {
    const ong = await this.repository.findOne({
      where: { id },
    });

    return ong;
  }

  public create(ongData: ICreateOngDto): Ong {
    const ong = this.repository.create(ongData);

    return ong;
  }

  public save(ong: Ong): Promise<Ong> {
    return this.repository.save(ong);
  }
}
