import { Global, Module } from '@nestjs/common';
import { FileService } from './services';
import { FileRepository } from './repositories';

@Global()
@Module({
  controllers: [],
  providers: [FileService, FileRepository],
  exports: [FileService, FileRepository],
})
export class FileModule {}
