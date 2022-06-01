import { container } from 'tsyringe';

import './providers';

import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { OngsRepository } from '@/repositories/implementations/OngsRepository';

import { IProjectsRepository } from '@/repositories/models/IProjectsRepository';
import { ProjectsRepository } from '@/repositories/implementations/ProjectsRepository';

container.registerSingleton<IOngsRepository>(
  'OngsRepository',
  OngsRepository,
);

container.registerSingleton<IProjectsRepository>(
  'ProjectsRepository',
  ProjectsRepository,
);