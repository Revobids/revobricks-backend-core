import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto, ChangePasswordDto } from '../../dto/employee.dto';
import { RealEstateDeveloperEmployee } from '../../entities';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    findAll(currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee[]>;
    findOne(id: string, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    update(id: string, updateUserDto: UpdateEmployeeDto, currentEmployee: RealEstateDeveloperEmployee): Promise<RealEstateDeveloperEmployee>;
    remove(id: string, currentEmployee: RealEstateDeveloperEmployee): Promise<void>;
    changePassword(changePasswordDto: ChangePasswordDto, currentEmployee: RealEstateDeveloperEmployee): Promise<void>;
}
