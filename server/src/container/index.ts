import { container } from 'tsyringe';

import './providers';

import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { OngsRepository } from '@/repositories/implementations/OngsRepository';

import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { ProjectsRepository } from '@/repositories/implementations/ProjectsRepository';

import { IProjectDonationsRepository } from '@/repositories/models/IProjectDonationsRepository';
import { ProjectDonationsRepository } from '@/repositories/implementations/ProjectDonationsRepository';

import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { UsersRepository } from '@/repositories/implementations/UsersRepository';

container.registerSingleton<IOngsRepository>(
  'OngsRepository',
  OngsRepository,
);

container.registerSingleton<IProjectsRepository>(
  'ProjectsRepository',
  ProjectsRepository,
);

container.registerSingleton<IProjectDonationsRepository>(
  'ProjectDonationsRepository',
  ProjectDonationsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);