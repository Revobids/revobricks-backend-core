import { CreateProjectDto } from './create-project.dto';
import { ProjectStatus } from '../../../entities/project.entity';
declare const UpdateProjectDto_base: import("@nestjs/common").Type<Partial<Omit<CreateProjectDto, "projectManagerId" | "salesManagerId">>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
    status?: ProjectStatus;
}
export {};
