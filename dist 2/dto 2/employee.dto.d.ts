import { UserRole } from '../entities/real-estate-developer-employee.entity';
export declare class CreateEmployeeDto {
    username: string;
    password: string;
    name: string;
    email: string;
    role: UserRole;
    officeId: string;
    employeeId?: string;
}
declare const UpdateEmployeeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeDto>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export {};
