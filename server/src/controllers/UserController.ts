import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from '@/useCases/CreateUserUseCase';
import { SendUserValidationEmailUseCase } from '@/useCases/SendUserValidationEmailUseCase';
import { UpdateUserUseCase } from '@/useCases/UpdateUserUseCase';

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
    const sendUserValidationEmailUseCase = container.resolve(SendUserValidationEmailUseCase);

    const user = await createUserUseCase.execute({
      name, 
      cpf, 
      email,
      phone,
      birth_date,
      password,
    });

    await sendUserValidationEmailUseCase.execute(user.id);

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> { 
    const user_id = request.user.id;

    const { 
      name, 
      cpf, 
      email,
      phone,
      birth_date,
      password,
      old_password,
    } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await updateUserUseCase.execute({
      user_id,
      name, 
      cpf, 
      email,
      phone,
      birth_date,
      password,
      old_password,
    });

    return response.json(user);
  }
}