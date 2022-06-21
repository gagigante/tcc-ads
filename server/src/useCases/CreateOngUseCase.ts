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
  address: {
    zip_code: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: number;
  };
  ong_contacts: string[];
  social_links: Array<{
    social_link_type: 'facebook' |'twitter' | 'instagram';
    social_link_url: string;
  }>
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
    address,
    ong_contacts,
    social_links,
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
      ong_address: {
        zip_code: address.zip_code,
        state: address.state,
        city: address.city,
        district: address.district,
        street: address.street,
        number: address.number,
      },
      ong_contacts: ong_contacts.map(item => ({ contact: item })),
      ong_social_links: social_links,
    });

    const response = await this.ongsRepository.save(newOng);

    const updatedUser = await this.usersRepository.save({
      ...user,
      ong_id: newOng.id,
      role: 'gestor',
    });

    return { 
      ong: instanceToInstance(response), 
      user: instanceToInstance(updatedUser),
    };
  }
}
