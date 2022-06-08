import path from 'path';
import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { IMailProvider } from '@/container/providers/MailProvider/models/IMailProvider';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IMailTemplateProvider } from '@/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { User } from '@/entities/User';
import { instanceToInstance } from 'class-transformer';
import { IHashProvider } from '@/container/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
export class RedefinePasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.getUserByPredicate({ reset_password_token: token });

    if (!user) {
      throw new AppError('User was not found', 404);
    }
   
    const updatedUser = this.usersRepository.create({
      ...user,
      password: await this.hashProvider.generateHash(password),
    });

    await this.usersRepository.save(updatedUser);
  }
}
