import { container } from 'tsyringe';

import { IMailProvider } from './models/IMailProvider';
import { EtherialMailProvider } from './implementations/EtherialMailProvider';
import { SESMailProvider } from './implementations/SESMailProvider';

import { mailConfig } from '@/config/mail';

// REVIEW
const providers = {
  ethereal: container.resolve(EtherialMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers['ethereal'],
);