import { container } from 'tsyringe';

import { IMailProvider } from './models/IMailProvider';
import { EtherialMailProvider } from './implementations/EtherialMailProvider';
import { SESMailProvider } from './implementations/SESMailProvider';

import { mailConfig } from '@/config/mail';

const providers = {
  ethereal: EtherialMailProvider,
  ses: SESMailProvider,
};

container.registerSingleton<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);