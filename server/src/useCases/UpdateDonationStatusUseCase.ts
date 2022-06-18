import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { ProjectDonation } from '@/entities/ProjectDonation';

interface IRequestDTO {
  user_id: number;
  donation_id: number;
}

@injectable()
export class UpdateDonationStatusUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute({
    user_id,
    donation_id,
   }: IRequestDTO): Promise<ProjectDonation> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id) {
      throw new AppError('Unauthorized', 401);
    }

    const donation = await this.projectDonationsRepository.getProjectDonation(donation_id);

    if (!donation) {
      throw new AppError('Donation was not found', 404);
    }

    donation.status = 'realizado';

    return instanceToInstance(donation);
  }
}
