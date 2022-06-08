import path from 'path';
import { injectable, inject } from 'tsyringe';

import { IMailProvider } from '@/container/providers/MailProvider/models/IMailProvider';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IMailTemplateProvider } from '@/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export class SendUserValidationEmailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async execute(userId: number): Promise<void> {
    if (Number.isNaN(userId)) {
      throw new AppError('Invalid ID');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new AppError('User was not found', 404);
    }

    const validatePasswordTemplate = path.resolve(
      __dirname,
      '..',
      'templates',
      'validate_email_template.hbs',
    );

    const html = await this.mailTemplateProvider.parse({
      file: validatePasswordTemplate,
      variables: {
        name: user.name,
        link: `${process.env.APP_CLIENT_URL}/validate-user?token=${user.activation_token}`,
      },
    });

    return this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Doa+] Ative sua conta!',
      html,
    });
  }
}
