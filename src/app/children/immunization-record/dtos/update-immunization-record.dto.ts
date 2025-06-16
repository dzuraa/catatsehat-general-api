import { PartialType } from '@nestjs/mapped-types';
import { CreateImmunizationRecordDto } from './create-immunization-record.dto';

export class UpdateImmunizationRecordDto extends PartialType(
  CreateImmunizationRecordDto,
) {}
