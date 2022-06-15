import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateOngThumbnailUseCase } from '@/useCases/UpdateOngThumbnailUseCase';

export class OngThumbnailController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateOngThumbnailUseCase = container.resolve(UpdateOngThumbnailUseCase);

    const ong = await updateOngThumbnailUseCase.execute({
      user_id: request.user.id,
      ong_id: Number(id),
      filename: request.file.filename,
    });

    return response.json(ong);
  }
}