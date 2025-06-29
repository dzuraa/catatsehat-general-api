import { PartialType } from '@nestjs/mapped-types';
import { CreateImmunizationOptionalRecordDto } from './create-immunization-optional-record.dto';

export class UpdateImmunizationOptionalRecordDto extends PartialType(
  CreateImmunizationOptionalRecordDto,
) {}
