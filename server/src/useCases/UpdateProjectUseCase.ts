import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { Project } from '@/entities/Project';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';

interface IRequestDTO {
  user_id: number;
  project_id: number;
  name: string;
  description: string;
  donation_description: string;
  donation_value_goal?: number;
  donation_goal?: number;
}

@injectable()
export class UpdateProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,

    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({
    user_id,
    project_id,
    name,
    description,
    donation_description,
    donation_value_goal,
    donation_goal,
   }: IRequestDTO): Promise<Project> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id || user.role === 'doador') {
      throw new AppError('Invalid permission', 401);
    }

    const ong = await this.ongsRepository.getOngById(user.ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    if (!ong.is_active) {
      throw new AppError('Ong was not found', 404);
    }

    const project = await this.projectsRepository.getProjectById(project_id);

    if (project.ong_id !== ong.id) {
      throw new AppError('Project was not found', 404);
    }

    project.name = name;
    project.description = description;
    project.donation_description = donation_description;
    project.donation_value_goal = donation_value_goal;
    project.donation_goal = donation_goal;
 
    const updatedProject = await this.projectsRepository.save(project);

    return instanceToInstance(updatedProject);
  }
}
