import { UpdateProjectCoverUseCase } from '@/useCases/UpdateProjectCoverUseCase';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export class ProjectCoverController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateProjectCoverUseCase = container.resolve(UpdateProjectCoverUseCase);

    const project = await updateProjectCoverUseCase.execute({
      user_id: request.user.id,
      project_id: Number(id),
      filename: request.file.filename,
    });

    return response.json(project);
  }
}