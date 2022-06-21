
import { FindOptionsWhere, Repository } from 'typeorm';

import { appDataSource } from '@/database/dataSource';

import { Project } from "@/entities/Project";
import { ICreateProjectDto } from "@/dtos/ICreateProjectDto";
import { IProjectsRepository } from "../models/IProjectsRepository";

export class ProjectsRepository implements IProjectsRepository {
  private repository: Repository<Project>;

  constructor() {
    this.repository = appDataSource.getRepository(Project);
  }

  public async getAllProjects(
    query?: FindOptionsWhere<Project> | FindOptionsWhere<Project>[]
  ): Promise<Project[]> {
    const projects = await this.repository.find({
      where: query,
    });

    return projects; 
  }

  public async getProjectById(id: number): Promise<Project | null> {
    const projects = await this.repository.findOne({
      where: { id },
    });

    return projects;
  }

  public async countOngProjects(ongId: number): Promise<number> {
    const projectsCount = await this.repository.count({
      where: { ong_id: ongId },
    });

    return projectsCount;
  }

  public create(data: ICreateProjectDto): Project {
    const project = this.repository.create(data);

    return project
  }

  public async save(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  public async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}