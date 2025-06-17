import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateReportAdminDto {
  @ApiPropertyOptional({
    enum: ReportStatus,
    example: `${ReportStatus.PENDING} / ${ReportStatus.RESOLVED}`,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status: ReportStatus;
}
