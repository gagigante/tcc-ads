import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetActiveOngsUseCase } from '@/useCases/GetActiveOngsUseCase';
import { GetActiveOngByIdUseCase } from '@/useCases/GetActiveOngByIdUseCase';
import { CreateOngUseCase } from '@/useCases/CreateOngUseCase';
import { UpdateOngUseCase } from '@/useCases/UpdateOngUseCase';

export class OngsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    const getActiveOngsUseCase = container.resolve(GetActiveOngsUseCase);

    const ongs = await getActiveOngsUseCase.execute(String(search || ''));

    return response.json(ongs);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getActiveOngByIdUseCase = container.resolve(GetActiveOngByIdUseCase);

    const ong = await getActiveOngByIdUseCase.execute(Number(id));

    return response.json(ong);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { 
      name,
      description,
      cnpj, 
      website_url,
      whatsapp_url,
      address,
      ong_contacts,
      social_links,
    } = request.body;

    const createOngUseCase = container.resolve(CreateOngUseCase);

    const { ong, user } = await createOngUseCase.execute({
      user_id,
      name,
      description,
      cnpj, 
      website_url,
      whatsapp_url,
      address,
      ong_contacts,
      social_links,
    });

    return response.json({ ong, user });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { 
      name,
      description,
      cnpj, 
      website_url,
      whatsapp_url,
      address,
      ong_contacts,
      social_links,
    } = request.body;

    const updateOngUseCase = container.resolve(UpdateOngUseCase);

    const ong = await updateOngUseCase.execute({
      user_id,
      name,
      description,
      cnpj, 
      website_url,
      whatsapp_url,
      address,
      ong_contacts,
      social_links,
    });

    return response.json(ong);
  }
}