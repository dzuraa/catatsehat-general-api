import { ApiProperty } from '@nestjs/swagger';
import { AnswerOption } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

class PregnancyMonitoringAnswerDto {
  @ApiProperty({
    description: 'UUID of the pregnancy monitoring question',
    example: 'uuid',
  })
  @IsString()
  pregnancyMonitoringQuestionId: string;

  @ApiProperty({
    description: 'Answer option for the question',
    enum: AnswerOption,
    example: 'YES',
  })
  @IsEnum(AnswerOption)
  answer: AnswerOption;
}

export class CreatePregnancyMonitoringAnswersDto {
  @ApiProperty()
  motherId: string;

  @ApiProperty()
  weekPregnancyMonitoringId: string;

  @ApiProperty({
    description:
      'Array of pregnancy monitoring answers (exactly 13 answers required)',
    type: [PregnancyMonitoringAnswerDto],
    minItems: 13,
    maxItems: 13,
    example: Array.from({ length: 13 }, () => ({
      pregnancyMonitoringQuestionId: 'uuid',
      answer: 'YES/NO',
    })),
  })
  @ValidateNested({ each: true })
  @Type(() => PregnancyMonitoringAnswerDto)
  @ArrayMinSize(13)
  @ArrayMaxSize(13)
  answers: PregnancyMonitoringAnswerDto[];
}
