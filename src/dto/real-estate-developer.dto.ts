import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateRealEstateDeveloperDto {
  @ApiProperty({ example: 'ABC Real Estate' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Leading real estate developer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@abcrealestate.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  ownerUsername: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  ownerPassword: string;

  @ApiProperty({ example: 'admin@abcrealestate.com' })
  @IsEmail()
  ownerEmail: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  ownerName: string;
}

export class UpdateRealEstateDeveloperDto extends PartialType(
  CreateRealEstateDeveloperDto,
) {}
