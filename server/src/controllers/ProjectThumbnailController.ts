import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateProjectThumbnailUseCase } from '@/useCases/UpdateProjectThumbnailUseCase';

export class ProjectThumbnailController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateProjectThumbnailUseCase = container.resolve(UpdateProjectThumbnailUseCase);

    const ong = await updateProjectThumbnailUseCase.execute({
      user_id: request.user.id,
      project_id: Number(id),
      filename: request.file.filename,
    });

    return response.json(ong);
  }
}