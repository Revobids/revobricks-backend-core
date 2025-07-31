import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

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

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: AWS.S3;
  private bucketName: string;
  private cloudfrontDomain?: string;

  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  constructor(private configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.s3 = new AWS.S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
      endpoint: awsConfig.s3.endpoint,
    });
    this.bucketName = awsConfig.s3.bucketName;
    this.cloudfrontDomain = awsConfig.cloudfront?.domain;
  }

  async uploadFile(
    file: Express.Multer.File,
    options: S3UploadOptions,
  ): Promise<S3UploadResult> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = options.fileName || `${uuidv4()}.${fileExtension}`;
    const key = `${options.folder}/${fileName}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType:
        options.contentType ||
        file.mimetype ||
        this.getMimeType(file.originalname),
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        ...options.metadata,
      },
    };

    if (options.serverSideEncryption !== false) {
      params.ServerSideEncryption = 'AES256';
    }

    if (options.acl) {
      params.ACL = options.acl;
    }

    try {
      const result = await this.s3.upload(params).promise();
      this.logger.log(`File uploaded successfully: ${key}`);

      return {
        key: result.Key,
        url: result.Location,
        cdnUrl: this.cloudfrontDomain
          ? `https://${this.cloudfrontDomain}/${key}`
          : undefined,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: params.ContentType as string,
        etag: result.ETag,
      };
    } catch (error: any) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error: any) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const params = {
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    };

    try {
      const result = await this.s3.deleteObjects(params).promise();
      if (result.Errors && result.Errors.length > 0) {
        this.logger.error('Some files failed to delete:', result.Errors);
      }
      this.logger.log(`Deleted ${result.Deleted?.length || 0} files`);
    } catch (error: any) {
      this.logger.error(
        `Failed to delete files: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn || this.configService.get('aws.s3.signedUrlExpiry'),
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async getUploadSignedUrl(
    folder: string,
    fileName: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = `${folder}/${fileName}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Expires: expiresIn,
    };

    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);
    return { uploadUrl, key };
  }
}
