import { injectable, inject } from 'tsyringe';

import { AppError } from '@/errors/AppError';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { User } from '@/entities/User';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { instanceToInstance } from 'class-transformer';

@injectable()
export class ListOngCollaboratorsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute(userId: number): Promise<User[]> {
    if (Number.isNaN(userId)) {
      throw new AppError('Invalid user ID');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id || user.role !== 'gestor') {
      throw new AppError('Invalid permission', 401);
    }

    const ong = this.ongsRepository.getOngById(user.ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    const users = await this.usersRepository.getAllUsers({ ong_id: user.ong_id });

    return instanceToInstance(users.filter(item => item.id !== user.id)); 
  }
}
