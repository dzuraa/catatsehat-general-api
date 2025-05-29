import { Module } from '@nestjs/common';
import { FileService } from './services';
import { FileRepository } from './repositories';

@Module({
  controllers: [],
  providers: [FileService, FileRepository],
})
export class FileModule {}
