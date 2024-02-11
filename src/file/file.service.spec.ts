import { Test, TestingModule } from '@nestjs/testing';
import { getPhotoMock } from '../testing/get-photo.mock';
import { FileService } from './file.service';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('upload file', () => {
    it('upload method', async () => {
      const photo = await getPhotoMock();
      const fileName = 'photo-test.jpg';

      await fileService.upload(photo, fileName);
    });
  });
});
