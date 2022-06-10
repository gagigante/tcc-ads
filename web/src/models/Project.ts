export type Project = {
  id: number
  ong_id: number;
  name: string;
  description: string;
  donation_description: string;
  thumb_url: string;
  banner_url: string;
  donation_value_goal: number | null;
  donation_goal: number | null;
}