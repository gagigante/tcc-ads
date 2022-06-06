import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { authConfig } from '@/config/auth';
import { User } from '@/entities/User';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { IHashProvider } from '@/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@/errors/AppError';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    if (!user.is_active) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({
      subject: user.id,
      expiresIn
    }, secret);

    return { user: instanceToInstance(user), token };
  }
}
