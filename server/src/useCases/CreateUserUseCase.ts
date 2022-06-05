import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { IHashProvider } from '@/container/providers/HashProvider/models/IHashProvider';
import { User } from '@/entities/User';
import { AppError } from '@/errors/AppError';
import { instanceToInstance } from 'class-transformer';

interface IRequestDTO {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ 
    name, 
    cpf, 
    email,
    phone,
    birth_date,
    password,
   }: IRequestDTO): Promise<User> {
    let checkUserExists = await this.usersRepository.getUserByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email already in use');
    }

    checkUserExists = await this.usersRepository.getUserByPredicate({ cpf });

    if (checkUserExists) {
      throw new AppError('CPF already in use');
    }

    checkUserExists = await this.usersRepository.getUserByPredicate({ phone });

    if (checkUserExists) {
      throw new AppError('Phone number already in use');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      cpf,
      email,
      phone,
      birth_date,
      password: hashedPassword,
      role: 'doador',
      is_active: false,
      activation_token: uuidv4(),
    });

    await this.usersRepository.save(user);

    return instanceToInstance(user);
  }
}
