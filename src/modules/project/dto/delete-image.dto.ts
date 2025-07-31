import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteImageDto {
  @ApiProperty({
    description: 'URL of the image to delete',
    example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}