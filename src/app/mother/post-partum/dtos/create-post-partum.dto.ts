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
  @ApiProperty({
    description: 'UUID of the post partum record',
    example: 'record-uuid',
  })
  @IsString()
  postPartumRecordId: string;

  @ApiProperty({
    description: 'Array of post partum answers (exactly 14 answers required)',
    type: [PostPartumAnswerDto],
    minItems: 14,
    maxItems: 14,
    example: [
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
      {
        postPartumQuestionId: 'uuid',
        answer: 'YES',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => PostPartumAnswerDto)
  @ArrayMinSize(14) // validasi agar minimal 14 pertanyaan
  @ArrayMaxSize(14) // validasi agar maksimal 14 pertanyaan
  answers: PostPartumAnswerDto[];
}
