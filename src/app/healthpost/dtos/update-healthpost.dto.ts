import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthPostDto } from './create-healthpost.dto';

export class UpdateHealthPostDto extends PartialType(CreateHealthPostDto) {}
