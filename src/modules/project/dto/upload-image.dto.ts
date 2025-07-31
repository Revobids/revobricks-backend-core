import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ImageType {
  EXTERIOR = 'EXTERIOR',
  INTERIOR = 'INTERIOR',
  FLOOR_PLAN = 'FLOOR_PLAN',
  AMENITY = 'AMENITY',
  LOCATION = 'LOCATION',
  CONSTRUCTION = 'CONSTRUCTION',
  OTHER = 'OTHER',
}

export class UploadImageDto {
  @ApiProperty({
    enum: ImageType,
    description: 'Type of image being uploaded',
    default: ImageType.OTHER,
  })
  @IsOptional()
  @IsEnum(ImageType)
  type?: ImageType = ImageType.OTHER;

  @ApiProperty({
    description: 'Caption for the image',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;
}

export class UploadImageResponseDto {
  @ApiProperty({ description: 'Uploaded image URL' })
  url: string;

  @ApiProperty({ description: 'Image type' })
  type: string;

  @ApiProperty({ description: 'Image caption' })
  caption: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;
}