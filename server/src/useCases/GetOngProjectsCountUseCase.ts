import { injectable, inject } from 'tsyringe';

import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { AppError } from '@/errors/AppError';

@injectable()
export class GetOngProjectsCountUseCase {
  constructor(
    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,

    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute(ongId: number, searchTerm?: string): Promise<number> {
    if (Number.isNaN(ongId)) {
      throw new AppError('Invalid ID');
    }

    const ong = await this.ongsRepository.getOngById(ongId);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    if (!ong.is_active) {
      throw new AppError('Ong was not found', 404);
    }

    const projectsCount = await this.projectsRepository.countOngProjects(ongId);

    return projectsCount;
  }
}
