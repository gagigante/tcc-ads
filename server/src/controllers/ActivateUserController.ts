import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ActivateUserUseCase } from '@/useCases/ActivateUserUseCase';

export class ActivateUserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;

    const activateUserUseCase = container.resolve(ActivateUserUseCase);

    await activateUserUseCase.execute({ token: String(token) });

    return response.json({ response: 'User activated' });
  }
}