export declare class CreateOfficeDto {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    region?: string;
    phone?: string;
    isMainOffice?: boolean;
}
declare const UpdateOfficeDto_base: import("@nestjs/common").Type<Partial<CreateOfficeDto>>;
export declare class UpdateOfficeDto extends UpdateOfficeDto_base {
}
export {};
