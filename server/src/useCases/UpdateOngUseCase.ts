import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { Ong } from '@/entities/Ong';
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

// REVIEW
@injectable()
export class UpdateOngUseCase {
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
   }: IRequestDTO): Promise<Ong> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const ongs = await this.ongsRepository.getAllOngs({ cnpj });

    if (!!ongs.length && ongs[0]?.id !== user.ong_id) {
      throw new AppError('CNPJ already in use');
    }

    const ongToUpdate = await this.ongsRepository.getOngById(user.ong_id);

    if (!ongToUpdate) {
      throw new AppError('Ong was not found');
    }

    ongToUpdate.name = name;
    ongToUpdate.description = description;
    ongToUpdate.cnpj = cnpj;
    ongToUpdate.website_url = website_url;
    ongToUpdate.whatsapp_url = whatsapp_url;

    ongToUpdate.ong_address.zip_code = address.zip_code;
    ongToUpdate.ong_address.state = address.state;
    ongToUpdate.ong_address.city = address.city;
    ongToUpdate.ong_address.district = address.district;
    ongToUpdate.ong_address.street = address.street;
    ongToUpdate.ong_address.number = address.number;

    const ongSocialLinks = social_links.map(item => {
      const socialLink = new OngSocialLink();
      socialLink.social_link_type = item.social_link_type;
      socialLink.social_link_url = item.social_link_url;

      return socialLink;
    });

    ongToUpdate.ong_social_links = ongSocialLinks;
   

    // const newOngContacts = ong_contacts.map(item => {
    //   const contact = new OngContact();

    //   contact.ong_id =  ongToUpdate.id;
    //   contact.contact = item

    //   return contact;
    // });

    // ongToUpdate.ong_contacts = newOngContacts;

    // const newOngSocialLinks = social_links.map(item => {
    //   const socialLink = new OngSocialLink();

    //   socialLink.ong_id =  ongToUpdate.id;
    //   socialLink.social_link_type = item.social_link_type;
    //   socialLink.social_link_url = item.social_link_url;

    //   return socialLink;
    // });

    // ongToUpdate.ong_social_links = newOngSocialLinks;
    
    await this.ongsRepository.save(ongToUpdate);

    return instanceToInstance(ongToUpdate);
  }
}
