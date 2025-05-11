import { Module } from '@nestjs/common';
import { OtpRepository } from './repositories';

@Module({
  providers: [OtpRepository],
  exports: [OtpRepository],
})
export class OtpModule {}
