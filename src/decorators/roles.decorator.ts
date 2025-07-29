import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/real-estate-developer-employee.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
