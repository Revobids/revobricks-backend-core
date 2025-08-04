export declare enum ImageType {
    EXTERIOR = "EXTERIOR",
    INTERIOR = "INTERIOR",
    FLOOR_PLAN = "FLOOR_PLAN",
    AMENITY = "AMENITY",
    LOCATION = "LOCATION",
    CONSTRUCTION = "CONSTRUCTION",
    OTHER = "OTHER"
}
export declare class UploadImageDto {
    type?: ImageType;
    caption?: string;
}
export declare class UploadImageResponseDto {
    url: string;
    type: string;
    caption: string;
    fileSize: number;
    mimeType: string;
}
