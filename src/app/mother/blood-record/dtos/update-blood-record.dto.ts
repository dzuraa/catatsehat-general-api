import { PartialType } from '@nestjs/mapped-types';
import { CreateBloodRecordDto } from './create-blood-record.dto';

export class UpdateBloodRecordDto extends PartialType(CreateBloodRecordDto) {}
