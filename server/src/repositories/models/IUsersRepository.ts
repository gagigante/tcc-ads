import { FindOptionsWhere } from 'typeorm';

import { User } from '@/entities/User';
import { ICreateUserDto } from '@/dtos/ICreateUserDto';

export interface IUsersRepository {
  getAllUsers(
    query?: FindOptionsWhere<User> | FindOptionsWhere<User>[]
  ): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  create(data: ICreateUserDto): User;
  save(user: User): Promise<User>;
}
