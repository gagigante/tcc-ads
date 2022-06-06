import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';

interface IRequestDTO {
  token: string;
}

@injectable()
export class ActivateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ token }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.getUserByPredicate({ activation_token: token });

    if (!user) {
      throw new AppError('Use was not found', 404);
    }

    if (user.is_active) {
      throw new AppError('User is already active', 400);
    }

    const updatedUser = this.usersRepository.create({
      ...user,
      is_active: true,
    });

    await this.usersRepository.save(updatedUser);
  }
}
