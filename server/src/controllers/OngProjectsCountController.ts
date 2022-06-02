import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOngProjectsCountUseCase } from '@/useCases/GetOngProjectsCountUseCase';

export class OngProjectsCountController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getOngProjectsCountUseCase = container.resolve(GetOngProjectsCountUseCase);

    const projectsCount = await getOngProjectsCountUseCase.execute(Number(id));

    return response.json({ projects: projectsCount });
  }
}