import { ProjectRole } from '../../../entities/project-employee.entity';
export declare class AssignEmployeeDto {
    employeeId: string;
    role: ProjectRole;
    assignedDate?: Date;
}
