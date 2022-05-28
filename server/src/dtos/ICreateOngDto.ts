export interface ICreateOngDto {
  name: string;
  description: string;
  cpnj: string;
  thumb_url: string;
  banner_url: string;
  website_url?: string;
  whatsapp_url?: string;
}