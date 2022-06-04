import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from '@/useCases/CreateUserUseCase';

export class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { 
      name, 
      cpf, 
      email,
      phone,
      birth_date,
      password,
    } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name, 
      cpf, 
      email,
      phone,
      birth_date,
      password,
    });

    return response.json(user);
  }
}