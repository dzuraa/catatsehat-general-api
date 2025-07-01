import { PartialType } from '@nestjs/mapped-types';
import { CreateLungsDto } from './create-lungs.dto';

export class UpdateLungsDto extends PartialType(CreateLungsDto) {}
