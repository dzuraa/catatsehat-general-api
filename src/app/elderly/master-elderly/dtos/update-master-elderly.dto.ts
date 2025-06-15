import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterElderlyDto } from './create-master-elderly.dto';

export class UpdateMasterElderlyDto extends PartialType(
  CreateMasterElderlyDto,
) {}
