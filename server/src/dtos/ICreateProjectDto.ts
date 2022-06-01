export interface ICreateProjectDto {
  ong_id: number;
  name: string;
  description: string;
  donation_description: string;
  thumb_url: string;
  banner_url: string;
  donation_value_goal?: number;
  donation_goal?: number;
}