import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateImmunizationRecordDto {
  @ApiProperty()
  @IsString()
  vaccineStageId: string;

  @ApiProperty()
  @IsNumber()
  dateGiven: number;

  @ApiProperty()
  @IsString()
  note: string;
}

export class CreateImmunizationArrayDto {
  @ApiProperty()
  @IsString()
  childrenId: string;

  @ApiProperty({
    type: [CreateImmunizationRecordDto],
  })
  @IsArray()
  @IsNotEmpty()
  immunizations: CreateImmunizationRecordDto[];
}
