import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';

interface IRequestDTO {
  loggedUserId: number;
  collaboratorId: number
}

@injectable()
export class RemoveOngCollaboratorUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute({ 
    loggedUserId,
    collaboratorId,
   }: IRequestDTO): Promise<void> {
    if (Number.isNaN(loggedUserId) || Number.isNaN(collaboratorId) ) {
      throw new AppError('Invalid user ID');
    }

    const user = await this.usersRepository.getUserById(loggedUserId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    if (!user.ong_id || user.role !== 'gestor') {
      throw new AppError('Invalid permission', 401);
    }

    const ong = await this.ongsRepository.getOngById(user.ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    const collaborator = await this.usersRepository.getUserById(collaboratorId);

    if (!collaborator) {
      throw new AppError('User was not found', 404);
    }

    if (collaborator.ong_id !== ong.id) {
      throw new AppError('Invalid permission', 401);
    }

    collaborator.ong_id = null;
    collaborator.role = 'doador';

    await this.usersRepository.save(collaborator);
  }
}
