export type Ong = {
  id: number;
  cpnj: string;
  name: string;
  description: string;
  banner_url: string;
  ong_contacts: Array<{
    contact: string;
  }>;
  whatsapp_url: string | null;
  website_url: string | null;
  ong_social_links: Array<{
    social_link_type: 'facebook' | 'instagram' | 'twitter';
    social_link_url: string;
  }>;
  ong_address: {
    zip_code: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: number,
  }
};
