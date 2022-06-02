import { injectable, inject } from 'tsyringe';

import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { AppError } from '@/errors/AppError';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';

@injectable()
export class GetProjectDonationsCountUseCase {
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

    const donationsCount = await this.projectDonationsRepository.countProjectDonations(projectId);

    return donationsCount;
  }
}
