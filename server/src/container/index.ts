import { container } from 'tsyringe';

import './providers';

import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { OngsRepository } from '@/repositories/implementations/OngsRepository';

container.registerSingleton<IOngsRepository>(
  'OngsRepository',
  OngsRepository,
);