import { PartialType } from '@nestjs/mapped-types';
import { CreateMotherDto } from './create-mother.dto';

export class UpdateMotherDto extends PartialType(CreateMotherDto) {}
