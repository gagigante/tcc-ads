import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { Project } from '@/entities/Project';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { AppError } from '@/errors/AppError';

@injectable()
export class GetProjectByIdUseCase {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute(projectId: number): Promise<Project> {
    if (Number.isNaN(projectId)) {
      throw new AppError('Invalid ID');
    }

    const project = await this.projectsRepository.getProjectById(projectId);

    if (!project) {
      throw new AppError('Project was not found', 404);
    }

    return instanceToInstance(project);
  }
}
