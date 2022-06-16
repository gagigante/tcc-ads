import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { User } from '@/entities/User';
import { AppError } from '@/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';

interface IRequestDTO {
  loggedUserId: number;
  collaboratorEmail: string;
  collaboratorRole: 'doador' | 'colaborador' | 'gestor';
}

@injectable()
export class CreateOngCollaboratorUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute({ 
    loggedUserId,
    collaboratorEmail,
    collaboratorRole,
   }: IRequestDTO): Promise<User> {
    if (Number.isNaN(loggedUserId)) {
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

    const collaborator = await this.usersRepository.getUserByEmail(collaboratorEmail);

    if (!collaborator) {
      throw new AppError('User was not found', 404);
    }

    if (collaborator.ong_id) {
      throw new AppError('User already is associated with an Ong', 400);
    }

    collaborator.ong_id = ong.id;
    collaborator.role = collaboratorRole;

    await this.usersRepository.save(collaborator);

    return instanceToInstance(collaborator);
  }
}
