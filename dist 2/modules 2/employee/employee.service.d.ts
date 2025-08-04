import { Repository } from 'typeorm';
import { RealEstateDeveloperEmployee } from '../../entities';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
export declare class EmployeeService {
    private employeeRepository;
    constructor(employeeRepository: Repository<RealEstateDeveloperEmployee>);
    create(createEmployeeDto: CreateEmployeeDto, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    findAll(currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee[]>;
    findOne(id: string, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    remove(id: string, currentEmployee: RealEstateDeveloperEmployee): Promise<void>;
    changePassword(employeeId: string, oldPassword: string, newPassword: string): Promise<void>;
}
