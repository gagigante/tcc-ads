export interface ICreateOngDto {
  name: string;
  description: string;
  cnpj: string; 
  website_url?: string;
  whatsapp_url?: string;
  ong_address: {
		zip_code: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: number;
	};
  ong_contacts: Array<{ contact: string }>;
  ong_social_links: Array<{
    social_link_type: 'facebook' | 'instagram' | 'twitter';
    social_link_url: string;
  }>;
}