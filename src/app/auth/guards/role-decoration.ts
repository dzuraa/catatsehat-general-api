import { SetMetadata } from '@nestjs/common';
import { AdminRole } from 'src/common/enums/admin-role';
export const RoleAllowed = (...role: AdminRole[]) => SetMetadata('roles', role);
