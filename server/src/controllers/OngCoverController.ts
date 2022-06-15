import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateOngCoverUseCase } from '@/useCases/UpdateOngCoverUseCase';

export class OngCoverController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateOngCoverUseCase = container.resolve(UpdateOngCoverUseCase);

    const ong = await updateOngCoverUseCase.execute({
      user_id: request.user.id,
      ong_id: Number(id),
      filename: request.file.filename,
    });

    return response.json(ong);
  }
}