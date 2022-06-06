import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetUserDonationsUseCase } from '@/useCases/GetUserDonationsUseCase';

export class UserDonationsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const getUserDonationsUseCase = container.resolve(GetUserDonationsUseCase);

    const donationsCount = await getUserDonationsUseCase.execute(user_id);

    return response.json({ donations: donationsCount });
  }
}