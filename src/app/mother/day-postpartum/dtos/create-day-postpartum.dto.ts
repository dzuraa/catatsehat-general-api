import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDayPostpartumDto {
  @ApiProperty()
  @IsString()
  name: string;
}
