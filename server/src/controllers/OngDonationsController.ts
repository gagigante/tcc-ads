import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetOngDonationsUseCase } from '@/useCases/GetOngDonationsUseCase';

export class OngDonationsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const getOngDonationsUseCase = container.resolve(GetOngDonationsUseCase);

    const projectDonations = await getOngDonationsUseCase.execute(user_id);

    return response.json(projectDonations);
  }
}