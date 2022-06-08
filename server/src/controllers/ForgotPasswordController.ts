import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordMailUseCase } from '@/useCases/SendForgotPasswordMailUseCase';

export class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordMailUseCase = container.resolve(SendForgotPasswordMailUseCase);

    const user = await sendForgotPasswordMailUseCase.execute(email);

    return response.json(user);
  }
}