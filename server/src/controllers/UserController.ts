import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from '@/useCases/CreateUserUseCase';
import { SendUserValidationEmailUseCase } from '@/useCases/SendUserValidationEmailUseCase';

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
}