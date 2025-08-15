import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadBrochureDto {
  @ApiProperty({
    description: 'Name for the brochure (optional, will use original filename if not provided)',
    example: 'Project Brochure 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}

export class UploadBrochureResponseDto {
  @ApiProperty({
    description: 'URL of the uploaded brochure',
    example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/123/brochures/brochure.pdf',
  })
  url: string;

  @ApiProperty({
    description: 'Name of the brochure',
    example: 'Project Brochure 2024',
  })
  name: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 2048576,
  })
  fileSize: number;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  mimeType: string;
}