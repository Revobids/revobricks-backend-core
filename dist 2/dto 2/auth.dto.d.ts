import { UserRole } from '../entities/real-estate-developer-employee.entity';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    password: string;
    name: string;
    email: string;
    role: UserRole;
    realEstateDeveloperId: string;
    officeId: string;
    employeeId?: string;
}
