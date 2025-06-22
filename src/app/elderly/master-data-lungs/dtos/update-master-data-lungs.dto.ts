import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterDataLungsDto } from './create-master-data-lungs.dto';

export class UpdateMasterDataLungsDto extends PartialType(CreateMasterDataLungsDto) {}
