import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthPostDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'name cannot be empty',
  })
  @IsString({
    message: 'name must be a string',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'address cannot be empty',
  })
  @IsString({
    message: 'address must be a string',
  })
  address: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'subDistrictId cannot be empty',
  })
  @IsString({
    message: 'subDistrictId must be a string',
  })
  subDistrictId: string;
}
