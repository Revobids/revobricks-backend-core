import { ApiProperty } from '@nestjs/swagger';

export class DeleteImageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Image deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'URL of the deleted image',
    example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/image.jpg',
  })
  deletedImageUrl: string;

  @ApiProperty({
    description: 'Number of remaining images in the project',
    example: 5,
  })
  remainingImagesCount: number;
}