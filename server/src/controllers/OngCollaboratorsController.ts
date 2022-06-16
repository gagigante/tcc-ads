import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListOngCollaboratorsUseCase } from '@/useCases/ListOngCollaboratorsUseCase';
import { CreateOngCollaboratorUseCase } from '@/useCases/CreateOngCollaboratorUseCase';
import { RemoveOngCollaboratorUseCase } from '@/useCases/RemoveOngCollaboratorUseCase';

export class OngCollaboratorsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listOngCollaboratorsUseCase = container.resolve(ListOngCollaboratorsUseCase);

    const users = await listOngCollaboratorsUseCase.execute(user_id);

    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { email, role } = request.body;

    const createOngCollaboratorUseCase = container.resolve(CreateOngCollaboratorUseCase);

    const collaborator = await createOngCollaboratorUseCase.execute({ 
      loggedUserId: user_id, 
      collaboratorEmail: email,
      collaboratorRole: role,
    });

    return response.json(collaborator);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { id: collaboratorId } = request.params;

    const removeOngCollaboratorUseCase = container.resolve(RemoveOngCollaboratorUseCase);

    await removeOngCollaboratorUseCase.execute({ loggedUserId: user_id, collaboratorId: Number(collaboratorId) });

    return response.status(201).end();
  }
}