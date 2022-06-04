import { ISendMailDto } from '../dtos/ISendMailDto';

export interface IMailProvider {
  sendMail(data: ISendMailDto): Promise<void>;
}
