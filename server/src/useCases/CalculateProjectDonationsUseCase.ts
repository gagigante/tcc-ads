import { injectable, inject } from 'tsyringe';

import { AppError } from '@/errors/AppError';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';

@injectable()
export class CalculateProjectDonationsUseCase {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute(projectId: number): Promise<number> {
    if (Number.isNaN(projectId)) {
      throw new AppError('Invalid ID');
    }

    const project = await this.projectsRepository.getProjectById(projectId);

    if (!project) {
      throw new AppError('Project was not found', 404);
    }

    const donations = await this.projectDonationsRepository.getProjectDonations(projectId);

    const donationsValue = donations
      .filter(donation => donation.status === 'realizado')
      .reduce((acc, item) => {
        return acc + item.value;
      }, 0);

    return donationsValue;
  }
}
