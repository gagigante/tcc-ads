import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateDonationUseCase } from '@/useCases/CreateDonationUseCase';
import { UpdateDonationStatusUseCase } from '@/useCases/UpdateDonationStatusUseCase';

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

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { id } = request.params;

    const updateDonationStatusUseCase = container.resolve(UpdateDonationStatusUseCase);

    const donation = await updateDonationStatusUseCase.execute({
      user_id,
      donation_id: Number(id),
    });

    return response.json(donation);
  }
}