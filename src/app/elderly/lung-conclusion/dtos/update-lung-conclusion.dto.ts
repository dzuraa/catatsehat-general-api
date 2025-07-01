import { PartialType } from '@nestjs/mapped-types';
import { CreateLungConclusionDto } from './create-lung-conclusion.dto';

export class UpdateLungConclusionDto extends PartialType(CreateLungConclusionDto) {}
