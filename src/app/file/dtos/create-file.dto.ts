import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  fileName: string;

  /**
   * @example data:image/png;base64,iVBORw0KGgo=
   */
  @ApiProperty()
  file: string;
}
