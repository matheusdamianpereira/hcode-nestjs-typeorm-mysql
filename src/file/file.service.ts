import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  async getDestinationPath() {
    return join(__dirname, '..', '..', 'storage', 'photos');
  }

  async upload(file: Express.Multer.File, fileName: string) {
    const destinationPath = await this.getDestinationPath();

    const path = join(destinationPath, fileName);

    await writeFile(path, file.buffer);

    return path;
  }
}
