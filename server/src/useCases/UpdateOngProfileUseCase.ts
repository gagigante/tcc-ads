import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { Ong } from '@/entities/Ong';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';

interface IRequestDTO {
  user_id: number;
  ong_id: number;
  name: string;
  description: string;
  cnpj: string;
  website_url?: string;
  whatsapp_url?: string;
}

@injectable()
export class UpdateOngProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute({
    user_id,
    ong_id,
    name,
    description,
    cnpj,
    website_url,
    whatsapp_url,
   }: IRequestDTO): Promise<Ong> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const ong = await this.ongsRepository.getOngById(ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    if (!ong.is_active) {
      throw new AppError('Ong was not found', 404);
    }

    if (user.ong_id !== ong_id) {
      throw new AppError('Invalid permission', 401);
    }

    const checkIfCnpjIsInUse = await this.ongsRepository.getOng({ cnpj });

    if (checkIfCnpjIsInUse && checkIfCnpjIsInUse.id !== ong_id) {
      throw new AppError('CNPJ already in use', 400);
    }

    ong.name = name;
    ong.description = description;
    ong.website_url = website_url;
    ong.whatsapp_url = whatsapp_url;
    
    const updatedOng = await this.ongsRepository.save(ong);

    return instanceToInstance(updatedOng);
  }
}
