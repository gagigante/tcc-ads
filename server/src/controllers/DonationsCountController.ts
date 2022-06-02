import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetProjectDonationsCountUseCase } from '@/useCases/GetProjectDonationsCountUseCase';

export class DonationsCountController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getProjectDonationsCountUseCase = container.resolve(GetProjectDonationsCountUseCase);

    const donationsCount = await getProjectDonationsCountUseCase.execute(Number(id));

    return response.json({ donations: donationsCount });
  }
}