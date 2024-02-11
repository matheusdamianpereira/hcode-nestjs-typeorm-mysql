import { FileService } from '../file/file.service';

export const FileServiceMock = {
  provide: FileService,
  useValue: {
    upload: jest.fn(),
    getDestinationPath: jest.fn().mockResolvedValue(''),
  },
};
