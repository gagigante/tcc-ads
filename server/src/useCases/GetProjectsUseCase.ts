import { injectable, inject } from 'tsyringe';
import { ILike } from 'typeorm';
import { instanceToInstance } from 'class-transformer';

import { Project } from '@/entities/Project';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';

@injectable()
export class GetProjectsUseCase {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute(searchTerm?: string): Promise<Project[]> {
    const projects = await this.projectsRepository.getAllProjects({ 
      name: ILike('%' + searchTerm + '%'),
    });

    return instanceToInstance(projects);
  }
}
