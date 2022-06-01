import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetProjectsUseCase } from '@/useCases/GetProjectsUseCase';
import { GetProjectById } from '@/useCases/GetProjectById';

export class ProjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    const getProjectsUseCase = container.resolve(GetProjectsUseCase);

    const projects = await getProjectsUseCase.execute(String(search || ''));

    return response.json(projects);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getProjectById = container.resolve(GetProjectById);

    const project = await getProjectById.execute(Number(id));

    return response.json(project);
  }
}