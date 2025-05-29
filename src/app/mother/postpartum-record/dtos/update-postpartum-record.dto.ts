import { PartialType } from '@nestjs/mapped-types';
import { CreatePostpartumRecordDto } from './create-postpartum-record.dto';

export class UpdatePostpartumRecordDto extends PartialType(CreatePostpartumRecordDto) {}
