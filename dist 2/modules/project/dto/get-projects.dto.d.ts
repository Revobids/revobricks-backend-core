import { ProjectType, PropertyType } from '../../../entities/project.entity';
export declare class GetProjectsDto {
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    projectType?: ProjectType;
    propertyType?: PropertyType;
}
