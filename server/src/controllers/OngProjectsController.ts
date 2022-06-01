import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOngProjectsUseCase } from '@/useCases/GetOngProjectsUseCase';

export class OngProjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { search } = request.query;

    const getOngProjectsUseCase = container.resolve(GetOngProjectsUseCase);

    const projects = await getOngProjectsUseCase.execute(Number(id), String(search || ''));

    return response.json(projects);
  }
}