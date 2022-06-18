import { IStorageProvider } from '@/container/providers/StorageProvider/models/IStorageProvider';
import { Project } from '@/entities/Project';
import { AppError } from '@/errors/AppError';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { instanceToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

interface IRequestDTO {
  user_id: number;
  project_id: number;
  filename: string;
}

@injectable()
export class UpdateProjectCoverUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,

    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    project_id,
    filename,
  }: IRequestDTO): Promise<Project> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!user.ong_id || user.role === 'doador') {
      throw new AppError('Unauthorized', 401);
    }

    const ong = await this.ongsRepository.getOngById(user.ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    const project = await this.projectsRepository.getProjectById(project_id);

    if (!project) {
      throw new AppError('Project was not found', 404);
    }

    if (project.banner_url) {
      await this.storageProvider.deleteFile(project.banner_url);
    }

    const bannerFilename = await this.storageProvider.saveFile(filename);

    project.banner_url = bannerFilename;

    await this.projectsRepository.save(project);

    return instanceToInstance(project);
  }
}
