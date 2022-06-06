import { injectable, inject } from 'tsyringe';

import { ProjectDonation } from '@/entities/ProjectDonation';
import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { AppError } from '@/errors/AppError';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';

@injectable()
export class GetUserDonationsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute(userId: number): Promise<ProjectDonation[]> {
    if (Number.isNaN(userId)) {
      throw new AppError('Invalid ID');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const projects = await this.projectDonationsRepository.getUserDonations(userId);

    return projects;
  }
}
