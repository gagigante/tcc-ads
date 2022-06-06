import { ICreateProjectDonationDto } from '@/dtos/ICreateProjectDonationDto';
import { ProjectDonation } from '@/entities/ProjectDonation';

export interface IProjectDonationsRepository {
  getUserDonations(userId: number): Promise<ProjectDonation[]>;
  getProjectDonations(projectId: number): Promise<ProjectDonation[]>;
  getProjectDonation(id: number): Promise<ProjectDonation | null>;
  countProjectDonations(projectId: number): Promise<number>;
  create(data: ICreateProjectDonationDto): ProjectDonation;
  save(donation: ProjectDonation): Promise<ProjectDonation>;
}
