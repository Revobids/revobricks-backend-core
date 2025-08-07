import { ApiProperty } from '@nestjs/swagger';

export class UploadLogoResponseDto {
  @ApiProperty({ description: 'Uploaded logo URL' })
  url: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'Real estate developer ID' })
  developerId: string;
}