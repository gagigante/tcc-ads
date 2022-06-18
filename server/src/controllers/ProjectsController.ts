import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetProjectsUseCase } from '@/useCases/GetProjectsUseCase';
import { GetProjectByIdUseCase } from '@/useCases/GetProjectByIdUseCase';
import { RemoveProjectUseCase } from '@/useCases/RemoveProjectUseCase';
import { UpdateProjectUseCase } from '@/useCases/UpdateProjectUseCase';

export class ProjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    const getProjectsUseCase = container.resolve(GetProjectsUseCase);

    const projects = await getProjectsUseCase.execute(String(search || ''));

    return response.json(projects);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getProjectByIdUseCase = container.resolve(GetProjectByIdUseCase);

    const project = await getProjectByIdUseCase.execute(Number(id));

    return response.json(project);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const {
      name,
      description,
      donation_description,
      donation_value_goal,
      donation_goal,   
    } = request.body;

    const createProjectUseCase = container.resolve(CreateProjectUseCase);

    const project = await createProjectUseCase.execute({
      user_id,
      name,
      description,
      donation_description,
      donation_value_goal,
      donation_goal,
    });

    return response.json(project);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { id } = request.params;

    const {
      name,
      description,
      donation_description,
      donation_value_goal,
      donation_goal,   
    } = request.body;

    const updateProjectUseCase = container.resolve(UpdateProjectUseCase);

    const project = await updateProjectUseCase.execute({
      user_id,
      project_id: Number(id),
      name,
      description,
      donation_description,
      donation_value_goal,
      donation_goal,
    });

    return response.json(project);
  }
}