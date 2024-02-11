import { ReadStream, createReadStream } from 'fs';
import { join } from 'path';

const getFileToBuffer = (
  filePath: string,
): Promise<{ buffer: Buffer; stream: ReadStream }> => {
  const readStream = createReadStream(filePath);
  const chunks = [];

  return new Promise((resolve, reject) => {
    readStream.on('data', (chunk) => chunks.push(chunk));

    readStream.on('error', (err) => reject(err));

    readStream.on('close', () =>
      resolve({
        buffer: Buffer.concat(chunks) as Buffer,
        stream: readStream as ReadStream,
      }),
    );
  });
};

export const getPhotoMock = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo.jpg'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'photo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpg',
    size: 1024 * 50,
    stream,
    destination: '',
    filename: 'file-name',
    path: 'file-path',
    buffer,
  };

  return photo;
};
