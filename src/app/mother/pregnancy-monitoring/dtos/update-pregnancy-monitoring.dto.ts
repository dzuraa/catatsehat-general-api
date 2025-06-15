import { PartialType } from '@nestjs/mapped-types';
import { CreatePregnancyMonitoringAnswersDto } from './create-pregnancy-monitoring.dto';

export class UpdatePregnancyMonitoringDto extends PartialType(
  CreatePregnancyMonitoringAnswersDto,
) {}
