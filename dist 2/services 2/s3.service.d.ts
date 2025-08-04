import { ConfigService } from '@nestjs/config';
export interface S3UploadOptions {
    folder: string;
    fileName?: string;
    contentType?: string;
    metadata?: Record<string, string>;
    serverSideEncryption?: boolean;
    acl?: string;
}
export interface S3UploadResult {
    key: string;
    url: string;
    cdnUrl?: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    etag: string;
}
export declare class S3Service {
    private configService;
    private readonly logger;
    private s3;
    private bucketName;
    private cloudfrontDomain?;
    private getMimeType;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, options: S3UploadOptions): Promise<S3UploadResult>;
    deleteFile(key: string): Promise<void>;
    deleteFiles(keys: string[]): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    getUploadSignedUrl(folder: string, fileName: string, contentType: string, expiresIn?: number): Promise<{
        uploadUrl: string;
        key: string;
    }>;
}
