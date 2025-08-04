export declare class CreateRealEstateDeveloperDto {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    ownerUsername: string;
    ownerPassword: string;
    ownerEmail: string;
    ownerName: string;
}
declare const UpdateRealEstateDeveloperDto_base: import("@nestjs/common").Type<Partial<CreateRealEstateDeveloperDto>>;
export declare class UpdateRealEstateDeveloperDto extends UpdateRealEstateDeveloperDto_base {
}
export {};
