import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import { IMailProvider } from '../models/IMailProvider';
import { ISendMailDto } from '../dtos/ISendMailDto';

import { mailConfig } from '@/config/mail';

export class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'sa-east-1',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    html,
  }: ISendMailDto): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });
  }
}
