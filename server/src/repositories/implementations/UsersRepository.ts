import { FindOptionsWhere, Repository } from 'typeorm';

import { appDataSource } from '@/database/dataSource';
import { ICreateUserDto } from '@/dtos/ICreateUserDto';
import { User } from '@/entities/User';

import { IUsersRepository } from '../models/IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = appDataSource.getRepository(User);
  }

  public async getAllUsers(query?: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User[]> {
    const users = await this.repository.find({
      where: query,
    });

    return users
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ 
      where: { email },
    });

    return user;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    return user;
  }

  public async getUserByPredicate(
    query?: FindOptionsWhere<User> | FindOptionsWhere<User>
  ): Promise<User | null> {
    const user = await this.repository.findOne({
      where: query
    });

    return user;
  }

  public create(data: ICreateUserDto): User {
    const user = this.repository.create(data);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}