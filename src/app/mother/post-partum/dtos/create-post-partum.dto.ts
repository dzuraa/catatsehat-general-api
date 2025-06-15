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

class PostPartumAnswerDto {
  @ApiProperty({
    description: 'UUID of the post partum question',
    example: 'uuid',
  })
  @IsString()
  postPartumQuestionId: string;

  @ApiProperty({
    description: 'Answer option for the question',
    enum: AnswerOption,
    example: 'YES',
  })
  @IsEnum(AnswerOption)
  answer: AnswerOption;
}

export class CreatePostPartumAnswersDto {
  @ApiProperty()
  motherId: string;

  @ApiProperty()
  dayPostPartumId: string;

  @ApiProperty({
    description: 'Array of post partum answers (exactly 18 answers required)',
    type: [PostPartumAnswerDto],
    minItems: 18,
    maxItems: 18,
    example: Array.from({ length: 18 }, () => ({
      postPartumQuestionId: 'uuid',
      answer: 'YES/NO',
    })),
  })
  @ValidateNested({ each: true })
  @Type(() => PostPartumAnswerDto)
  @ArrayMinSize(18)
  @ArrayMaxSize(18)
  answers: PostPartumAnswerDto[];
}
