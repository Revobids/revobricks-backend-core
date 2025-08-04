import { RealEstateDeveloper } from './real-estate-developer.entity';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
import { ProjectEmployee } from './project-employee.entity';
import { Bookmark } from './bookmark.entity';
export declare enum ProjectStatus {
    UNPUBLISHED = "UNPUBLISHED",
    PUBLISHED = "PUBLISHED"
}
export declare enum ProjectType {
    RESIDENTIAL = "RESIDENTIAL",
    COMMERCIAL = "COMMERCIAL",
    MIXED_USE = "MIXED_USE"
}
export declare enum PropertyType {
    APARTMENT = "APARTMENT",
    VILLA = "VILLA",
    PLOT = "PLOT",
    OFFICE = "OFFICE",
    SHOP = "SHOP",
    WAREHOUSE = "WAREHOUSE"
}
export declare class Project {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    status: ProjectStatus;
    projectType: ProjectType;
    propertyType: PropertyType;
    totalUnits: number;
    totalArea: number;
    areaUnit: string;
    expectedCompletionDate: Date;
    constructionStartDate: Date;
    amenities: string[];
    amenitiesDescription: string;
    reraNumber: string;
    reraApprovalDate: Date;
    reraWebsite: string;
    legalDetails: string;
    approvals: {
        name: string;
        authority: string;
        approvalNumber: string;
        approvalDate: Date;
    }[];
    minPrice: number;
    maxPrice: number;
    currency: string;
    floorPlans: {
        type: string;
        area: number;
        areaUnit: string;
        bedrooms: number;
        bathrooms: number;
        price: number;
    }[];
    images: {
        url: string;
        type: string;
        caption: string;
    }[];
    brochures: {
        url: string;
        name: string;
    }[];
    realEstateDeveloperId: string;
    realEstateDeveloper: RealEstateDeveloper;
    projectManagerId: string;
    projectManager: RealEstateDeveloperEmployee;
    salesManagerId: string;
    salesManager: RealEstateDeveloperEmployee;
    projectEmployees: ProjectEmployee[];
    bookmarks: Bookmark[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
