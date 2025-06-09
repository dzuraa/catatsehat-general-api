import { Module } from '@nestjs/common';
import { PregnancyMonitoringQuestionHttpController } from './controllers';
import { PregnancyMonitoringQuestionRepository } from './repositories';
import { PregnancyMonitoringQuestionService } from './services';

@Module({
  controllers: [PregnancyMonitoringQuestionHttpController],
  providers: [
    PregnancyMonitoringQuestionService,
    PregnancyMonitoringQuestionRepository,
  ],
})
export class PregnancyMonitoringQuestionModule {}
