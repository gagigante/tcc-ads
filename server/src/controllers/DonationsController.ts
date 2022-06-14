import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateDonationUseCase } from '@/useCases/CreateDonationUseCase';

export class DonationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { project_id, type, description, value } = request.body;

    const createDonationUseCase = container.resolve(CreateDonationUseCase);

    const donation = await createDonationUseCase.execute({
      user_id,
      project_id: Number(project_id), 
      type, 
      description, 
      value,
      filename: request.file.filename,
    });

    return response.json(donation);
  }
}