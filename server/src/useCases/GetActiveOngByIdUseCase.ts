import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { Ong } from '@/entities/Ong';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { AppError } from '@/errors/AppError';

@injectable()
export class GetActiveOngByIdUseCase {
  constructor(
    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute(id: number): Promise<Ong> {
    if (Number.isNaN(id)) {
      throw new AppError('Invalid ID');
    }

    const ong = await this.ongsRepository.getOngById(id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    if (!ong.is_active) {
      throw new AppError('Ong was not found', 404);
    }

    return instanceToInstance(ong);
  }
}
