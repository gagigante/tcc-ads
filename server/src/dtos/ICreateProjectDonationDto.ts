export interface ICreateProjectDonationDto {
  project_id: number;
  user_id: number;
  type: 'dinheiro' | 'outro';
  description: string;
  value?: number;
  file?: string;
}