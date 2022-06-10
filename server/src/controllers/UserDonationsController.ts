import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetUserDonationsUseCase } from '@/useCases/GetUserDonationsUseCase';
import { GetUserDonationByIdUseCase } from '@/useCases/GetUserDonationByIdUseCase';

export class UserDonationsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const getUserDonationsUseCase = container.resolve(GetUserDonationsUseCase);

    const donationsCount = await getUserDonationsUseCase.execute(user_id);

    return response.json({ donations: donationsCount });
  }

  public async show(request: Request, response: Response): Promise<Response> { 
    const user_id = request.user.id;
    
    const { id: donationId } = request.params;

    const getUserDonationByIdUseCase = container.resolve(GetUserDonationByIdUseCase);

    const donation = await getUserDonationByIdUseCase.execute(user_id, Number(donationId));

    return response.json(donation);
  }
}