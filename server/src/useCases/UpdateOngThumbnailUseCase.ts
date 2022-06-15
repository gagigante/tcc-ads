import { IStorageProvider } from '@/container/providers/StorageProvider/models/IStorageProvider';
import { Ong } from '@/entities/Ong';
import { AppError } from '@/errors/AppError';
import { IOngsRepository } from '@/repositories/models/IOngsRepository';
import { IUsersRepository } from '@/repositories/models/IUsersRepository';
import { instanceToInstance } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

interface IRequestDTO {
  user_id: number;
  ong_id: number;
  filename: string;
}

@injectable()
export class UpdateOngThumbnailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('OngsRepository')
    private ongsRepository: IOngsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    ong_id,
    filename,
  }: IRequestDTO): Promise<Ong> {
    const user = await this.usersRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    const ong = await this.ongsRepository.getOngById(ong_id);

    if (!ong) {
      throw new AppError('Ong was not found', 404);
    }

    if (ong.id !== user.ong_id) {
      throw new AppError('Unauthorized', 401);
    }

    if (ong.thumb_url) {
      await this.storageProvider.deleteFile(ong.thumb_url);
    }

    const thumbnailFilename = await this.storageProvider.saveFile(filename);

    ong.thumb_url = thumbnailFilename;

    await this.ongsRepository.save(ong);

    return instanceToInstance(ong);
  }
}
