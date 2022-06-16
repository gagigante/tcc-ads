import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListOngCollaboratorsUseCase } from '@/useCases/ListOngCollaboratorsUseCase';

export class OngCollaboratorsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listOngCollaboratorsUseCase = container.resolve(ListOngCollaboratorsUseCase);

    const users = await listOngCollaboratorsUseCase.execute(user_id);

    return response.json(users);
  }
}