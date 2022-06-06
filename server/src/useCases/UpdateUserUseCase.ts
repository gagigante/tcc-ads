import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { IHashProvider } from '@/container/providers/HashProvider/models/IHashProvider';
import { User } from '@/entities/User';
import { AppError } from '@/errors/AppError';

interface IRequestDTO {
  user_id: number
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password?: string;
  old_password?: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name, 
    cpf, 
    email,
    phone,
    birth_date,
    password,
    old_password,
   }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    let checkUserExists = await this.usersRepository.getUserByEmail(email);

    console.log({ email })
    console.log({ userId: user.id, checkUserExists: checkUserExists.id });

    if (checkUserExists && checkUserExists.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    checkUserExists = await this.usersRepository.getUserByPredicate({ cpf });

    if (checkUserExists && checkUserExists.id !== user_id) {
      throw new AppError('CPF already in use');
    }

    checkUserExists = await this.usersRepository.getUserByPredicate({ phone });

    if (checkUserExists && checkUserExists.id !== user_id) {
      throw new AppError('Phone number already in use');
    }

    user.name = name;
    user.birth_date = birth_date;

    if (password && !old_password) {
      throw new AppError('Invalid old password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return instanceToInstance(user);
  }
}
