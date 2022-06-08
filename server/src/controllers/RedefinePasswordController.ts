import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RedefinePasswordUseCase } from '@/useCases/RedefinePasswordUseCase';

export class RedefinePasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const redefinePasswordUseCase = container.resolve(RedefinePasswordUseCase);

    await redefinePasswordUseCase.execute({ token, password });

    return response.status(201).end();
  }
}