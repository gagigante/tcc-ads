import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetProjectsUseCase } from '@/useCases/GetProjectsUseCase';
import { GetProjectByIdUseCase } from '@/useCases/GetProjectByIdUseCase';

export class ProjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    const getProjectsUseCase = container.resolve(GetProjectsUseCase);

    const projects = await getProjectsUseCase.execute(String(search || ''));

    return response.json(projects);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getProjectByIdUseCase = container.resolve(GetProjectByIdUseCase);

    const project = await getProjectByIdUseCase.execute(Number(id));

    return response.json(project);
  }
}