import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { User } from '@/entities/User';
import { AppError } from '@/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { Ong } from '@/entities/Ong';
import { appDataSource } from '@/database/dataSource';
import { OngContact } from '@/entities/OngContact';
import { OngAddress } from '@/entities/OngAddress';
import { OngSocialLink } from '@/entities/OngSocialLink';

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
    });

    const newOngAddress = new OngAddress();
    newOngAddress.ong_id =  newOng.id;
    newOngAddress.zip_code =  address.zip_code;
    newOngAddress.state =  address.state;
    newOngAddress.city =  address.city;
    newOngAddress.district =  address.district;
    newOngAddress.street =  address.street;
    newOngAddress.number =  address.number;

    newOng.ong_address = newOngAddress;

    const newOngContacts = ong_contacts.map(item => {
      const contact = new OngContact();

      contact.ong_id =  newOng.id;
      contact.contact = item

      return contact;
    });

    newOng.ong_contacts = newOngContacts;

    const newOngSocialLinks = social_links.map(item => {
      const socialLink = new OngSocialLink();

      socialLink.ong_id =  newOng.id;
      socialLink.social_link_type = item.social_link_type;
      socialLink.social_link_url = item.social_link_url;

      return socialLink;
    });

    newOng.ong_social_links = newOngSocialLinks;
    
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
