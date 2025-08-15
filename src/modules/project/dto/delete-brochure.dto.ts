import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DeleteBrochureDto {
  @ApiProperty({
    description: 'URL of the brochure to delete',
    example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/123/brochures/brochure.pdf',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  brochureUrl: string;
}

export class DeleteBrochureResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Brochure deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'URL of the deleted brochure',
    example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/123/brochures/brochure.pdf',
  })
  deletedBrochureUrl: string;

  @ApiProperty({
    description: 'Number of remaining brochures (always 0 since only one brochure is allowed)',
    example: 0,
  })
  remainingBrochuresCount: number;
}