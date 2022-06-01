import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetActiveOngsUseCase } from '@/useCases/GetActiveOngsUseCase';
import { GetActiveOngByIdUseCase } from '@/useCases/GetActiveOngByIdUseCase';

export class OngsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    const getActiveOngsUseCase = container.resolve(GetActiveOngsUseCase);

    const ongs = await getActiveOngsUseCase.execute(String(search || ''));

    return response.json(ongs);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getActiveOngByIdUseCase = container.resolve(GetActiveOngByIdUseCase);

    const ong = await getActiveOngByIdUseCase.execute(Number(id));

    return response.json(ong);
  }
}