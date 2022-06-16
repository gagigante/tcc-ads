import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { User } from '@/entities/User';
import { AppError } from '@/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { Ong } from '@/entities/Ong';

interface IRequestDTO {
  user_id: number;
  name: string;
  description: string;
  cnpj: string;
  website_url?: string;
  whatsapp_url?: string;
}

@injectable()
export class CreateOngUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,
  ) {}

  public async execute({ 
    user_id,
    name,
    description,
    cnpj,
    website_url,
    whatsapp_url,
   }: IRequestDTO): Promise<{ ong: Ong, user: User }> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const ong = await this.ongsRepository.getAllOngs({ cnpj });

    if (!!ong.length) {
      throw new AppError('CNPJ already in use');
    }

    const newOng = this.ongsRepository.create({
      name,
      description,
      cnpj,
      website_url,
      whatsapp_url,
    });

    await this.ongsRepository.save(newOng);

    const updatedUser = await this.usersRepository.save({
      ...user,
      ong_id: newOng.id,
      role: 'gestor',
    });

    return { 
      ong: instanceToInstance(newOng), 
      user: instanceToInstance(updatedUser),
    };
  }
}
