import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
import { Office } from './office.entity';
export declare class RealEstateDeveloper {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    employees: RealEstateDeveloperEmployee[];
    offices: Office[];
}
