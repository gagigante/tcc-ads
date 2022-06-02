import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOngProjectsUseCase } from '@/useCases/GetOngProjectsUseCase';
import { GetOngProjectsCountUseCase } from '@/useCases/GetOngProjectsCountUseCase';

export class OngProjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { search } = request.query;

    const getOngProjectsUseCase = container.resolve(GetOngProjectsUseCase);

    const projects = await getOngProjectsUseCase.execute(Number(id), String(search || ''));

    return response.json(projects);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getOngProjectsCountUseCase = container.resolve(GetOngProjectsCountUseCase);

    const projectsCount = await getOngProjectsCountUseCase.execute(Number(id));

    return response.json({ projects: projectsCount });
  }
}