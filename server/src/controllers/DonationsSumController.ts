import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CalculateProjectDonationsUseCase } from '@/useCases/CalculateProjectDonationsUseCase';

export class DonationsSumController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const calculateProjectDonationsUseCase = container.resolve(CalculateProjectDonationsUseCase);

    const donationsValue = await calculateProjectDonationsUseCase.execute(Number(id));

    return response.json({ donations: donationsValue });
  }
}