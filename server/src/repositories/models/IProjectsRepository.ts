import { FindOptionsWhere } from 'typeorm';

import { ICreateProjectDto } from '@/dtos/ICreateProjectDto';
import { Project } from '@/entities/Project';

export interface IProjectsRepository {
  getAllProjects(
    query?: FindOptionsWhere<Project> | FindOptionsWhere<Project>[]
  ): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  countOngProjects(ongId: number): Promise<number>;  
  create(data: ICreateProjectDto): Project;
  save(project: Project): Promise<Project>;
}
