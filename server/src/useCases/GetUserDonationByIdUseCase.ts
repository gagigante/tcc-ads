import { injectable, inject } from 'tsyringe';

import { ProjectDonation } from '@/entities/ProjectDonation';
import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { AppError } from '@/errors/AppError';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';

@injectable()
export class GetUserDonationByIdUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute(userId: number, donationId: number): Promise<ProjectDonation> {
    if (Number.isNaN(userId)) {
      throw new AppError('Invalid user ID');
    }

    if (Number.isNaN(donationId)) {
      throw new AppError('Invalid donation ID');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const donation = await this.projectDonationsRepository.getProjectDonation(donationId);

    if (!donation) {
      throw new AppError('Donation was not found', 404);
    }

    if (donation.user_id !== userId) {
      throw new AppError('Donation was not found', 404);
    }

    return donation;
  }
}
