import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckupChildrenDto } from './create-checkup-children.dto';

export class UpdateCheckupChildrenDto extends PartialType(
  CreateCheckupChildrenDto,
) {}
