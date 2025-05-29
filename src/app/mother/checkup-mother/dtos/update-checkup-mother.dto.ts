import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCheckupMothersPublicDto } from './create-checkup-mother-public.dto';
import { CreateCheckupMothersAdminDto } from './create-checkup-mother.dto';

export class UpdateCheckupMotherDto extends PartialType(
  IntersectionType(CreateCheckupMothersAdminDto, CreateCheckupMothersPublicDto),
) {}
