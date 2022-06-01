import { injectable, inject } from 'tsyringe';
import { ILike } from 'typeorm';
import { instanceToInstance } from 'class-transformer';

import { Ong } from '@/entities/Ong';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';

@injectable()
export class GetActiveOngsUseCase {
  constructor(
    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute(searchTerm?: string): Promise<Ong[]> {
    const ongs = await this.ongsRepository.getAllOngs({ 
      is_active: true,
      name: ILike('%' + searchTerm + '%'),
     });

    return instanceToInstance(ongs);
  }
}
