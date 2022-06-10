import { Project } from './Project';

export type Donation = {
  id: number;
  project_id: number;
  project: Project;
  user_id: number;
  type: 'dinheiro' | 'outro';
  description: string;
  value?: number;
  file?: string;
  status: 'pendente' | 'realizado';
  created_at: string;
}