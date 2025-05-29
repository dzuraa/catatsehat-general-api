import { PartialType } from '@nestjs/mapped-types';
import { CreatePostPartumAnswersDto } from './create-post-partum.dto';

export class UpdatePostPartumDto extends PartialType(
  CreatePostPartumAnswersDto,
) {}
