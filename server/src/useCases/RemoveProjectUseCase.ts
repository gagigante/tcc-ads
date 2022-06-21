import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';

interface IRequestDTO {
  userId: number;
  projectId: number;
}

@injectable()
export class RemoveProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({ 
    userId,
    projectId,
   }: IRequestDTO): Promise<void> {
    if (Number.isNaN(userId) || Number.isNaN(projectId)) {
      throw new AppError('Invalid user ID');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id || user.role === 'doador') {
      throw new AppError('Invalid permission', 401);
    }

    const project = await this.projectsRepository.getProjectById(projectId);

    if (!project) {
      throw new AppError('Project was not found', 404);
    }

    if (project.ong_id !== user.ong_id) {
      throw new AppError('Invalid permission', 401);
    }

    await this.projectsRepository.delete(projectId);
  }
}
