import path from 'path';
import { injectable, inject } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { IMailProvider } from '@/container/providers/MailProvider/models/IMailProvider';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { AppError } from '@/errors/AppError';
import { IMailTemplateProvider } from '@/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { User } from '@/entities/User';
import { instanceToInstance } from 'class-transformer';

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async execute(email: string): Promise<User> {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError('User was not found', 404);
    }
    
    const resetPasswordToken = uuidv4();

    const updatedUser = this.usersRepository.create({
      ...user,
      reset_password_token: resetPasswordToken,
    });

    await this.usersRepository.save(updatedUser);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'templates',
      'forgot_password_template.hbs',
    );

    const html = await this.mailTemplateProvider.parse({
      file: forgotPasswordTemplate,
      variables: {
        name: user.name,
        link: `${process.env.APP_CLIENT_URL}/redefine-password?token=${resetPasswordToken}`,
      },
    });

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Doa+] Redefina sua senha!',
      html,
    });

    return instanceToInstance(updatedUser);
  }
}
