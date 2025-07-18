import { PartialType } from '@nestjs/mapped-types';
import { CreateBmiCategoryDto } from './create-bmi-category.dto';

export class UpdateBmiCategoryDto extends PartialType(CreateBmiCategoryDto) {}
