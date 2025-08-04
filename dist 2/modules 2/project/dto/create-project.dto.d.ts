import { ProjectType, PropertyType } from '../../../entities/project.entity';
declare class ApprovalDto {
    name: string;
    authority: string;
    approvalNumber: string;
    approvalDate: Date;
}
declare class FloorPlanDto {
    type: string;
    area: number;
    areaUnit: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
}
declare class ImageDto {
    url: string;
    type: string;
    caption: string;
}
declare class BrochureDto {
    url: string;
    name: string;
}
export declare class CreateProjectDto {
    name: string;
    description?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    projectType: ProjectType;
    propertyType: PropertyType;
    totalUnits: number;
    totalArea: number;
    areaUnit: string;
    expectedCompletionDate: Date;
    constructionStartDate: Date;
    amenities: string[];
    amenitiesDescription?: string;
    reraNumber?: string;
    reraApprovalDate?: Date;
    reraWebsite?: string;
    legalDetails?: string;
    approvals?: ApprovalDto[];
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    floorPlans?: FloorPlanDto[];
    images?: ImageDto[];
    brochures?: BrochureDto[];
    projectManagerId: string;
    salesManagerId: string;
}
export {};
