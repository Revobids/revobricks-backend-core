import { RealEstateDeveloper } from './real-estate-developer.entity';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
export declare class Office {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    region: string;
    phone: string;
    isMainOffice: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    realEstateDeveloper: RealEstateDeveloper;
    realEstateDeveloperId: string;
    employees: RealEstateDeveloperEmployee[];
}
