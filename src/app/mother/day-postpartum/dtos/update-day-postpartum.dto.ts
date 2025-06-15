import { PartialType } from '@nestjs/mapped-types';
import { CreateDayPostpartumDto } from './create-day-postpartum.dto';

export class UpdateDayPostpartumDto extends PartialType(CreateDayPostpartumDto) {}
