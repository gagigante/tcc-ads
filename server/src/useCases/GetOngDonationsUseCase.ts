import { injectable, inject } from 'tsyringe';
import { ILike } from 'typeorm';
import { instanceToInstance } from 'class-transformer';

import { Ong } from '@/entities/Ong';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { ProjectDonation } from '@/entities/ProjectDonation';
import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';

@injectable()
export class GetOngDonationsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute(userId: number): Promise<ProjectDonation[]> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id || user.role === 'doador') {
      throw new AppError('Unauthorized', 401);
    }

    const donations = await this.projectDonationsRepository.getOngDonations(user.ong_id);

    return instanceToInstance(donations);
  }
}
