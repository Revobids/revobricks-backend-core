import { Project } from './project.entity';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
export declare enum ProjectRole {
    PROJECT_MANAGER = "PROJECT_MANAGER",
    SALES_MANAGER = "SALES_MANAGER",
    SALES_EXECUTIVE = "SALES_EXECUTIVE",
    SITE_ENGINEER = "SITE_ENGINEER",
    ARCHITECT = "ARCHITECT",
    LEGAL_ADVISOR = "LEGAL_ADVISOR",
    MARKETING = "MARKETING",
    OTHER = "OTHER"
}
export declare class ProjectEmployee {
    id: string;
    projectId: string;
    project: Project;
    employeeId: string;
    employee: RealEstateDeveloperEmployee;
    role: ProjectRole;
    assignedDate: Date;
    isActive: boolean;
    createdAt: Date;
}
