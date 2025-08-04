import { RealEstateDeveloper } from './real-estate-developer.entity';
import { Office } from './office.entity';
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    SALES_MANAGER = "sales_manager",
    SALES_EXECUTIVE = "sales_executive",
    SALES = "sales",
    FINANCE = "finance"
}
export declare class RealEstateDeveloperEmployee {
    id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    employeeId: string;
    role: UserRole;
    isActive: boolean;
    firebaseUid: string;
    createdAt: Date;
    updatedAt: Date;
    realEstateDeveloper: RealEstateDeveloper;
    realEstateDeveloperId: string;
    office: Office;
    officeId: string;
}
