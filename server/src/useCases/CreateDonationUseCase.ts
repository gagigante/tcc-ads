import { injectable, inject } from 'tsyringe';
import multer from 'multer';

import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { ProjectDonation } from '@/entities/ProjectDonation';
import { AppError } from '@/errors/AppError';
import { uploadConfig } from '@/config/upload';

interface IRequestDTO {
  project_id: number;
  user_id: number;
  type: 'dinheiro' | 'outro';
  description?: string;
  value?: number;
  filename?: string;
}

const upload = multer(uploadConfig.multer);

@injectable()
export class CreateDonationUseCase {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,

    @inject('ProjectDonationsRepository')
    private projectDonationsRepository: IProjectDonationsRepository,
  ) {}

  public async execute({ 
    user_id,
    project_id,
    type,
    description,
    value,
    filename,
   }: IRequestDTO): Promise<ProjectDonation> {
    if (Number.isNaN(project_id)) {
      throw new AppError('Invalid project ID');
    }

    const project = await this.projectsRepository.getProjectById(project_id);

    if (!project) {
      throw new AppError('Project was not found', 404);
    }

    const donation = this.projectDonationsRepository.create({
      user_id,
      project_id,
      type,
      description,
      value,
      file: filename,
    });

    return this.projectDonationsRepository.save(donation);
  }
}
