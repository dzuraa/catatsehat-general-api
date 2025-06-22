import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePregnancyMonitoringRecordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'motherId cannot be empty',
  })
  @IsString({
    message: 'motherId must be a string',
  })
  motherId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'weekPregnancyMonitoringId cannot be empty',
  })
  @IsString({
    message: 'weekPregnancyMonitoringId must be a string',
  })
  weekPregnancyMonitoringId: string;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question1 must be a boolean',
  })
  question1: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question2 must be a boolean',
  })
  question2: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question3 must be a boolean',
  })
  question3: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question4 must be a boolean',
  })
  question4: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question5 must be a boolean',
  })
  question5: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question6 must be a boolean',
  })
  question6: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question7 must be a boolean',
  })
  question7: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question8 must be a boolean',
  })
  question8: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question9 must be a boolean',
  })
  question9: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question10 must be a boolean',
  })
  question10: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question11 must be a boolean',
  })
  question11: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question12 must be a boolean',
  })
  question12: boolean;

  @ApiProperty({
    example: 'true/false',
  })
  @IsBoolean({
    message: 'question13 must be a boolean',
  })
  question13: boolean;
}
