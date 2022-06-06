import { Repository } from 'typeorm';

import { appDataSource } from '@/database/dataSource';

import { ProjectDonation } from '@/entities/ProjectDonation';
import { IProjectDonationsRepository } from '../models/IProjectDonationsRepository';
import { ICreateProjectDonationDto } from '@/dtos/ICreateProjectDonationDto';

export class ProjectDonationsRepository implements IProjectDonationsRepository {
  private repository: Repository<ProjectDonation>;

  constructor() {
    this.repository = appDataSource.getRepository(ProjectDonation);
  }

  public async getUserDonations(userId: number): Promise<ProjectDonation[]> {
    const donations = await this.repository.find({
      where: { 
        user_id: userId,
      },
    });

    return donations;
  }

  public async getProjectDonations(projectId: number): Promise<ProjectDonation[]> {
    const donations = await this.repository.find({
      where: { 
        project_id: projectId ,
      },
    });

    return donations;
  }

  public async getProjectDonation(id: number): Promise<ProjectDonation | null> {
    const donation = await this.repository.findOne({
      where: { id },
    });

    return donation;
  }

  public async countProjectDonations(projectId: number): Promise<number> {
    const donationsCount = await this.repository.count({
      where: {        
        project_id: projectId,
      },
    });
    
    return donationsCount;
  }

  public create(donationData: ICreateProjectDonationDto): ProjectDonation {
    const donation = this.repository.create(donationData);

    return donation;
  }

  save(donation: ProjectDonation): Promise<ProjectDonation> {
    return this.repository.save(donation); 
  }  
}